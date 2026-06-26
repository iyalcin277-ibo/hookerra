import { NextResponse } from 'next/server';
import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  // Get current user session
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const paddleApiKey = process.env.PADDLE_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!paddleApiKey || !supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const adminClient = createAdmin(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Look up the stored paddle_subscription_id
  const { data: profile } = await adminClient
    .from('profiles')
    .select('paddle_subscription_id, subscription_status')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.paddle_subscription_id) {
    return NextResponse.json(
      { error: 'No active subscription found. If you just subscribed, try again in a moment.' },
      { status: 404 }
    );
  }

  if (profile.subscription_status === 'starter') {
    return NextResponse.json({ error: 'No active paid subscription.' }, { status: 400 });
  }

  // Call Paddle API to schedule cancellation at end of billing period
  const paddleBase =
    process.env.NEXT_PUBLIC_PADDLE_ENV === 'production'
      ? 'https://api.paddle.com'
      : 'https://sandbox-api.paddle.com';

  const res = await fetch(
    `${paddleBase}/subscriptions/${profile.paddle_subscription_id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduled_change: {
          action: 'cancel',
          effective_at: 'next_billing_period',
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error('[paddle cancel] Paddle API error:', res.status, body);
    return NextResponse.json(
      { error: `Paddle error: ${res.status}. Contact support if this persists.` },
      { status: 500 }
    );
  }

  console.log(`[paddle cancel] ✓ userId=${user.id} subscription=${profile.paddle_subscription_id} → cancel scheduled`);

  return NextResponse.json({ ok: true });
}
