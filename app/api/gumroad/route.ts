import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeTier } from '@/lib/plans';

/**
 * POST /api/gumroad
 *
 * Gumroad "Ping" webhook — called after every successful payment.
 * Gumroad sends application/x-www-form-urlencoded (FormData).
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL       — already in .env.local
 *   SUPABASE_SERVICE_ROLE_KEY      — from Supabase Dashboard → Settings → API
 */
export async function POST(request: Request) {
  // ── 1. Parse Gumroad FormData ──────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const email = (formData.get('email') as string | null)?.toLowerCase().trim();
  const productName = (formData.get('product_name') as string | null) ?? '';

  if (!email) {
    return NextResponse.json(
      { error: 'Missing required field: email.' },
      { status: 400 }
    );
  }

  // ── 2. Determine tier from product name ───────────────────────────────────
  const newTier = productName.toLowerCase().includes('unlimited')
    ? 'unlimited'
    : 'pro';

  // ── 3. Build admin Supabase client (bypasses RLS) ─────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[gumroad webhook] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return NextResponse.json(
      { error: 'Server configuration error.' },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── 4. Find user by email via admin Auth API ───────────────────────────────
  const { data: userList, error: listError } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error('[gumroad webhook] listUsers error:', listError.message);
    return NextResponse.json(
      { error: 'Failed to query users.', detail: listError.message },
      { status: 500 }
    );
  }

  const matchedUser = userList.users.find(
    (u) => u.email?.toLowerCase() === email
  );

  if (!matchedUser) {
    console.warn(`[gumroad webhook] No Supabase user found for email: ${email}`);
    return NextResponse.json(
      { error: `No account found for email: ${email}` },
      { status: 404 }
    );
  }

  // ── 5. Update profiles.subscription_status ────────────────────────────────
  const { error: updateError } = await adminClient
    .from('profiles')
    .update({ subscription_status: newTier })
    .eq('id', matchedUser.id);

  if (updateError) {
    console.error('[gumroad webhook] profile update error:', updateError.message);

    // Graceful hint for common errors
    let detail = updateError.message;
    if (updateError.code === '23514') {
      detail +=
        ' — subscription_status check constraint failed. Run migration 003_profiles_subscription_pro_unlimited.sql.';
    }
    return NextResponse.json(
      { error: 'Failed to update subscription.', detail },
      { status: 500 }
    );
  }

  console.log(
    `[gumroad webhook] ✓ ${email} → ${normalizeTier(newTier)} (product: "${productName}")`
  );

  return NextResponse.json(
    {
      success: true,
      email,
      plan: newTier,
      product: productName,
    },
    { status: 200 }
  );
}
