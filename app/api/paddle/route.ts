import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tierFromPriceId } from '@/lib/paddle';

// ─── Paddle Billing webhook event types we care about ────────────────────────

type PaddleEventType =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.canceled'
  | 'transaction.completed';

interface PaddleCustomer {
  id: string;
  email: string;
}

interface PaddlePriceItem {
  price: { id: string; name: string };
  quantity: number;
}

interface PaddleWebhookData {
  id: string;
  status: string;
  customer_id: string;
  customer?: PaddleCustomer;
  custom_data?: { userId?: string };
  items: PaddlePriceItem[];
}

interface PaddleEvent {
  event_type: PaddleEventType | string;
  data: PaddleWebhookData;
}

// ─── Signature verification ───────────────────────────────────────────────────

function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    // Header format: ts=<timestamp>;h1=<hmac>
    const ts = signatureHeader.match(/ts=(\d+)/)?.[1];
    const h1 = signatureHeader.match(/h1=([a-f0-9]+)/)?.[1];
    if (!ts || !h1) return false;

    const signed = `${ts}:${rawBody}`;
    const expected = createHmac('sha256', secret).update(signed).digest('hex');

    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(h1, 'hex'));
  } catch {
    return false;
  }
}

// ─── Admin Supabase helpers ───────────────────────────────────────────────────

function buildAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function resolveUserId(
  adminClient: ReturnType<typeof buildAdminClient>,
  customData: { userId?: string } | undefined,
  customerEmail?: string
): Promise<string | null> {
  // Prefer explicit userId passed via customData during checkout
  if (customData?.userId) return customData.userId;

  // Fall back to email lookup (slower, but handles old Gumroad-style flow)
  if (!customerEmail) return null;
  const { data } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = data?.users.find((u) => u.email?.toLowerCase() === customerEmail.toLowerCase());
  return user?.id ?? null;
}

async function setSubscriptionTier(
  adminClient: ReturnType<typeof buildAdminClient>,
  userId: string,
  tier: 'starter' | 'pro' | 'unlimited'
): Promise<void> {
  const isPaid = tier !== 'starter';
  const { error } = await adminClient
    .from('profiles')
    .update({
      subscription_status: tier,
      plan: isPaid ? tier : 'free',
      is_demo: !isPaid,
    })
    .eq('id', userId);
  if (error) throw error;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[paddle webhook] PADDLE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get('Paddle-Signature') ?? '';

  if (!verifySignature(rawBody, signatureHeader, webhookSecret)) {
    console.warn('[paddle webhook] Invalid signature — rejected.');
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  let event: PaddleEvent;
  try {
    event = JSON.parse(rawBody) as PaddleEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { event_type, data } = event;
  console.log(`[paddle webhook] event: ${event_type}`);

  try {
    const adminClient = buildAdminClient();

    // ── subscription.created / subscription.updated ──────────────────────────
    if (event_type === 'subscription.created' || event_type === 'subscription.updated') {
      const priceId = data.items[0]?.price?.id;
      const tier = priceId ? tierFromPriceId(priceId) : null;

      if (!tier) {
        console.warn(`[paddle webhook] Unknown price ID: ${priceId}`);
        return NextResponse.json({ ok: true, skipped: 'unknown price' });
      }

      const userId = await resolveUserId(adminClient, data.custom_data, data.customer?.email);
      if (!userId) {
        console.warn('[paddle webhook] Could not resolve user.');
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      await setSubscriptionTier(adminClient, userId, tier);
      console.log(`[paddle webhook] ✓ userId=${userId} → ${tier} (${event_type})`);
    }

    // ── subscription.canceled ─────────────────────────────────────────────────
    else if (event_type === 'subscription.canceled') {
      const userId = await resolveUserId(adminClient, data.custom_data, data.customer?.email);
      if (userId) {
        await setSubscriptionTier(adminClient, userId, 'starter');
        console.log(`[paddle webhook] ✓ userId=${userId} → starter (canceled)`);
      }
    }

    // ── transaction.completed (one-time purchases) ────────────────────────────
    else if (event_type === 'transaction.completed') {
      const priceId = data.items[0]?.price?.id;
      const tier = priceId ? tierFromPriceId(priceId) : null;

      if (tier) {
        const userId = await resolveUserId(adminClient, data.custom_data, data.customer?.email);
        if (userId) {
          await setSubscriptionTier(adminClient, userId, tier);
          console.log(`[paddle webhook] ✓ userId=${userId} → ${tier} (transaction)`);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[paddle webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
