import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tierFromPriceId } from '@/lib/paddle';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaddlePriceItem {
  price: { id: string; name: string };
  quantity: number;
}

interface PaddleWebhookData {
  id: string;               // subscription_id for subscription events
  status: string;
  customer_id?: string;
  customer?: { id: string; email: string };
  custom_data?: Record<string, unknown>;
  items?: PaddlePriceItem[];
  details?: { line_items?: PaddlePriceItem[] };
  transaction_id?: string;  // for transaction events
}

interface PaddleEvent {
  event_type: string;
  data: PaddleWebhookData;
}

// ─── GET — health check ───────────────────────────────────────────────────────

export function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/paddle',
    secret_set: !!process.env.PADDLE_WEBHOOK_SECRET,
    supabase_set: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    env: process.env.NEXT_PUBLIC_PADDLE_ENV ?? 'sandbox',
    skip_sig: process.env.PADDLE_SKIP_SIG === 'true',
  });
}

// ─── Signature verification ───────────────────────────────────────────────────

function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    const ts = signatureHeader.match(/ts=(\d+)/)?.[1];
    const h1 = signatureHeader.match(/h1=([a-f0-9]+)/)?.[1];
    if (!ts || !h1) return false;

    const signed = `${ts}:${rawBody}`;
    const expected = createHmac('sha256', secret).update(signed).digest('hex');

    // buffers must be same length for timingSafeEqual
    const expBuf = Buffer.from(expected, 'hex');
    const h1Buf = Buffer.from(h1, 'hex');
    if (expBuf.length !== h1Buf.length) return false;

    return timingSafeEqual(expBuf, h1Buf);
  } catch {
    return false;
  }
}

// ─── Supabase admin client ────────────────────────────────────────────────────

function buildAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Resolve Supabase user ID ─────────────────────────────────────────────────

async function resolveUserId(
  adminClient: ReturnType<typeof buildAdminClient>,
  customData: Record<string, unknown> | undefined,
  customerEmail?: string
): Promise<string | null> {
  // 1. userId explicitly passed via Paddle customData during checkout
  if (customData?.userId && typeof customData.userId === 'string') {
    return customData.userId;
  }

  // 2. Fall back to email lookup
  if (!customerEmail) return null;

  const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error('[paddle webhook] listUsers error:', error.message);
    return null;
  }

  const match = data?.users.find(
    (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
  );
  return match?.id ?? null;
}

// ─── Update profiles ──────────────────────────────────────────────────────────
// Uses upsert (onConflict: 'id') so the row is created if missing.
// id is always explicitly included to prevent null-constraint errors.

async function updateProfile(
  adminClient: ReturnType<typeof buildAdminClient>,
  userId: string,
  tier: 'starter' | 'pro' | 'unlimited',
  subscriptionId?: string,
  customerId?: string
): Promise<void> {
  if (!userId) throw new Error('updateProfile called with empty userId');

  const isPaid = tier !== 'starter';

  // ── Step 1: core columns (always exist) ───────────────────────────────────
  const coreData: Record<string, unknown> = {
    id: userId,                      // must be explicit for upsert
    subscription_status: tier,
  };

  const { error: e1 } = await adminClient
    .from('profiles')
    .upsert(coreData, { onConflict: 'id' });

  if (e1) {
    const hint = e1.message.includes('check constraint')
      ? ' → Run migration 003 in Supabase SQL Editor to allow pro/unlimited values.'
      : '';
    throw new Error(`Profile update failed: ${e1.message}${hint}`);
  }

  // ── Step 2: paddle IDs (migration 005) — non-fatal ────────────────────────
  if (subscriptionId || customerId) {
    const paddleData: Record<string, unknown> = {};
    if (subscriptionId) paddleData.paddle_subscription_id = subscriptionId;
    if (customerId)     paddleData.paddle_customer_id     = customerId;

    const { error: e2 } = await adminClient
      .from('profiles')
      .update(paddleData)
      .eq('id', userId);

    if (e2) console.warn(`[paddle webhook] paddle IDs skipped (run migration 005): ${e2.message}`);
  }

  // ── Step 3: plan + is_demo (migration 004) — non-fatal ────────────────────
  const { error: e3 } = await adminClient
    .from('profiles')
    .update({ plan: isPaid ? tier : 'free', is_demo: !isPaid })
    .eq('id', userId);

  if (e3) console.warn(`[paddle webhook] plan/is_demo skipped (run migration 004): ${e3.message}`);
}

// ─── Helper: extract price ID from either items or details.line_items ─────────

function extractPriceId(data: PaddleWebhookData): string | null {
  return (
    data.items?.[0]?.price?.id ??
    data.details?.line_items?.[0]?.price?.id ??
    null
  );
}

// ─── POST — main webhook handler ─────────────────────────────────────────────

export async function POST(request: Request) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[paddle webhook] PADDLE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get('Paddle-Signature') ?? '';

  const skipSig = process.env.PADDLE_SKIP_SIG === 'true';
  console.log('[paddle webhook] sig_header:', signatureHeader.slice(0, 80), '| skip_sig:', skipSig);

  if (!skipSig && !verifySignature(rawBody, signatureHeader, webhookSecret)) {
    console.warn(
      '[paddle webhook] Signature mismatch.\n' +
      '  → Make sure PADDLE_WEBHOOK_SECRET in Vercel matches the "Secret key" in Paddle\n' +
      '     Dashboard → Developer Tools → Notifications → [your endpoint] → Secret key.\n' +
      '  → Temporarily set PADDLE_SKIP_SIG=true in Vercel env to bypass for testing.'
    );
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  let event: PaddleEvent;
  try {
    event = JSON.parse(rawBody) as PaddleEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { event_type, data } = event;
  const priceId = extractPriceId(data);
  const tier = priceId ? tierFromPriceId(priceId) : null;
  const customerEmail = data.customer?.email;

  console.log(`[paddle webhook] event=${event_type} priceId=${priceId} tier=${tier} email=${customerEmail ?? 'none'} customData=${JSON.stringify(data.custom_data)}`);

  try {
    const adminClient = buildAdminClient();

    if (event_type === 'subscription.created' || event_type === 'subscription.updated') {
      if (!tier) {
        console.warn(`[paddle webhook] Unknown priceId: ${priceId} — add it to PADDLE_PRICE_IDS in lib/paddle.ts`);
        return NextResponse.json({ ok: true, skipped: `unknown_price:${priceId}` });
      }

      const userId = await resolveUserId(adminClient, data.custom_data, customerEmail);
      if (!userId) {
        console.warn('[paddle webhook] User not found. customData:', JSON.stringify(data.custom_data), 'email:', customerEmail);
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      await updateProfile(adminClient, userId, tier, data.id, data.customer_id);
      console.log(`[paddle webhook] ✓ ${userId} → ${tier} | sub=${data.id}`);
    }

    else if (event_type === 'subscription.canceled') {
      const userId = await resolveUserId(adminClient, data.custom_data, customerEmail);
      if (userId) {
        await updateProfile(adminClient, userId, 'starter');
        console.log(`[paddle webhook] ✓ ${userId} → starter (canceled)`);
      }
    }

    else if (event_type === 'transaction.completed') {
      if (tier) {
        const userId = await resolveUserId(adminClient, data.custom_data, customerEmail);
        if (userId) {
          await updateProfile(adminClient, userId, tier, undefined, data.customer_id);
          console.log(`[paddle webhook] ✓ ${userId} → ${tier} (transaction)`);
        }
      }
    }

    return NextResponse.json({ ok: true, event_type });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[paddle webhook] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
