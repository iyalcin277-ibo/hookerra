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
  id: string;
  status: string;
  customer_id?: string;
  // customer object is present in transaction events but not always in subscriptions
  customer?: { id: string; email: string };
  custom_data?: Record<string, unknown>;
  items?: PaddlePriceItem[];
  details?: { line_items?: PaddlePriceItem[] };
}

interface PaddleEvent {
  event_type: string;
  data: PaddleWebhookData;
}

// ─── GET — health check (lets you verify the endpoint is reachable) ───────────

export function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/paddle',
    secret_set: !!process.env.PADDLE_WEBHOOK_SECRET,
    supabase_set: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
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

// ─── Update profiles (resilient: subscription_status always; plan/is_demo optional) ──

async function updateProfile(
  adminClient: ReturnType<typeof buildAdminClient>,
  userId: string,
  tier: 'starter' | 'pro' | 'unlimited'
): Promise<void> {
  const isPaid = tier !== 'starter';

  // Always update subscription_status (column definitely exists)
  const { error: e1 } = await adminClient
    .from('profiles')
    .update({ subscription_status: tier })
    .eq('id', userId);

  if (e1) throw new Error(`subscription_status update failed: ${e1.message}`);

  // Try to update plan + is_demo (only exist after migration 004)
  const { error: e2 } = await adminClient
    .from('profiles')
    .update({ plan: isPaid ? tier : 'free', is_demo: !isPaid })
    .eq('id', userId);

  if (e2) {
    // Non-fatal: migration may not have been run yet
    console.warn(`[paddle webhook] plan/is_demo update skipped (run migration 004): ${e2.message}`);
  }
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

  // Log for debugging (remove in production if noisy)
  console.log('[paddle webhook] sig header:', signatureHeader.slice(0, 60));

  if (!verifySignature(rawBody, signatureHeader, webhookSecret)) {
    console.warn('[paddle webhook] Signature mismatch — check PADDLE_WEBHOOK_SECRET in Vercel env');
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
        console.warn('[paddle webhook] User not found. customData:', data.custom_data, 'email:', customerEmail);
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      await updateProfile(adminClient, userId, tier);
      console.log(`[paddle webhook] ✓ ${userId} → ${tier}`);
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
          await updateProfile(adminClient, userId, tier);
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
