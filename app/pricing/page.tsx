'use client';

import { useEffect, useRef, useState } from 'react';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PRICING_USD,
  yearlyMonthlyEquivalent,
  yearlyTotalUsd,
} from '@/lib/plans';
import { getPaddle, PADDLE_PRICE_IDS } from '@/lib/paddle';
import type { Paddle } from '@paddle/paddle-js';
import { createClient } from '@/lib/supabase/client';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

type Billing = 'monthly' | 'yearly';

function PriceHero({
  amount,
  suffix,
  micro,
  trialLabel,
}: {
  amount: string;
  suffix: string;
  micro?: string;
  trialLabel?: string;
}) {
  return (
    <div className="mt-6 text-left">
      {trialLabel && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-[#FF0000]/40 bg-[#FF0000]/10 px-3 py-1.5">
          <Gift className="h-3.5 w-3.5 text-[#FF0000]" strokeWidth={2} />
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF0000]">
            {trialLabel}
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {trialLabel ? (
          <span className="font-display text-[clamp(2.75rem,7vw,4rem)] font-black leading-[0.95] tracking-tighter text-[#FF0000] tabular-nums neon-red-text">
            $0
          </span>
        ) : (
          <span className="font-display text-[clamp(2.75rem,7vw,4rem)] font-black leading-[0.95] tracking-tighter text-white tabular-nums">
            {amount}
          </span>
        )}
        <span className="text-xs font-black uppercase tracking-[0.28em] text-[#A0A0A0]">
          {trialLabel ? 'first month' : suffix}
        </span>
      </div>
      {trialLabel && (
        <p className="mt-1.5 text-xs font-semibold text-[#A0A0A0]">
          then{' '}
          <span className="font-bold text-white">
            {amount} {suffix}
          </span>
        </p>
      )}
      {micro ? (
        <p className="mt-3 max-w-[18rem] font-mono text-[11px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#FF0000]/85">
          {micro}
        </p>
      ) : null}
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const paddleRef = useRef<Paddle | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    });
    getPaddle().then((p) => {
      paddleRef.current = p;
    });
  }, []);

  function openCheckout(priceId: string) {
    const paddle = paddleRef.current;
    if (!paddle) {
      console.warn('[paddle] Not initialized yet.');
      return;
    }
    if (!priceId) {
      console.warn('[paddle] Price ID not configured.');
      return;
    }
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: userEmail ? { email: userEmail } : undefined,
      customData: userId ? { userId } : undefined,
    });
  }

  const hasTrial = billing === 'monthly';

  const proEquiv =
    billing === 'yearly'
      ? yearlyMonthlyEquivalent(PRICING_USD.proMonthly)
      : PRICING_USD.proMonthly;
  const unlEquiv =
    billing === 'yearly'
      ? yearlyMonthlyEquivalent(PRICING_USD.unlimitedMonthly)
      : PRICING_USD.unlimitedMonthly;

  const proYearTotal = yearlyTotalUsd(PRICING_USD.proMonthly);
  const unlYearTotal = yearlyTotalUsd(PRICING_USD.unlimitedMonthly);

  const plans = [
    {
      id: 'starter',
      name: 'Free',
      highlight: false,
      badge: null as string | null,
      trial: false,
      priceId: null as string | null,
      lines: [
        '10 generations / month',
        'Tones: Professional, Casual, Street Style',
        '2 hooks per generation',
        'Video Script & Caption',
        '1 CTA · 5 hashtags',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      highlight: true,
      badge: hasTrial ? '1 Month Free' : 'Best Seller',
      trial: hasTrial,
      priceId: billing === 'monthly' ? PADDLE_PRICE_IDS.pro_monthly : PADDLE_PRICE_IDS.pro_yearly,
      lines: [
        '50 generations / month',
        'All tones (Professional … Funny)',
        '3 hooks per generation',
        'Video Script & Caption',
        '50 CTAs · 15 hashtags',
      ],
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      highlight: false,
      badge: hasTrial ? '1 Month Free' : null,
      trial: hasTrial,
      priceId:
        billing === 'monthly'
          ? PADDLE_PRICE_IDS.unlimited_monthly
          : PADDLE_PRICE_IDS.unlimited_yearly,
      lines: [
        'Unlimited generations',
        'All tones + early access to new features',
        '5 hooks per generation',
        'Video Script & Caption',
        '50 CTAs · 30 hashtags',
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <PublicNav />
      <main className="flex-1 px-6 pb-20 pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-display text-4xl font-black text-white sm:text-5xl">
            Explore our <span className="text-[#FF0000]">plans</span>
          </h1>
          <p className="mt-4 text-[#A0A0A0]">
            Start free; upgrade to Pro or Unlimited to unlock all tones, hashtags and more generations.
          </p>

          {/* Billing toggle */}
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#121212] bg-[#121212]/60 p-1">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={cn(
                  'rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition',
                  billing === 'monthly'
                    ? 'bg-[#FF0000] text-white neon-red-glow'
                    : 'text-[#A0A0A0] hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('yearly')}
                className={cn(
                  'rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition',
                  billing === 'yearly'
                    ? 'bg-[#FF0000] text-white neon-red-glow'
                    : 'text-[#A0A0A0] hover:text-white'
                )}
              >
                Yearly
              </button>
            </div>
            {billing === 'monthly' ? (
              <p className="flex items-center gap-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
                <Gift className="h-3.5 w-3.5" strokeWidth={2} />
                First month free on Pro &amp; Unlimited
              </p>
            ) : (
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
                {`Save ${PRICING_USD.yearlyDiscountPercent}% with annual billing`}
              </p>
            )}
          </div>
        </div>

        {/* Plan cards */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-3xl border p-8 transition',
                plan.highlight
                  ? 'border-[#FF0000] bg-[#121212] shadow-[0_0_30px_rgba(255,0,0,0.2)]'
                  : 'border-[#121212] bg-[#121212]/40'
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'absolute right-6 top-6 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white',
                    plan.trial && plan.id !== 'starter'
                      ? 'bg-[#FF0000] shadow-[0_0_12px_rgba(255,0,0,0.5)]'
                      : 'bg-[#FF0000]'
                  )}
                >
                  {plan.badge}
                </span>
              )}

              <h2 className="font-display text-2xl font-black text-white">{plan.name}</h2>

              {/* Starter */}
              {plan.id === 'starter' && (
                <PriceHero amount="$0" suffix="/ mo" micro="No credit card required" />
              )}

              {/* Pro monthly */}
              {plan.id === 'pro' && billing === 'monthly' && (
                <PriceHero
                  amount={`$${PRICING_USD.proMonthly.toFixed(2)}`}
                  suffix="/ mo"
                  trialLabel="1 month free"
                />
              )}
              {/* Pro yearly */}
              {plan.id === 'pro' && billing === 'yearly' && (
                <PriceHero
                  amount={`$${proEquiv.toFixed(2)}`}
                  suffix="/ mo"
                  micro={`Billed annually · ~$${proYearTotal.toFixed(0)} / year`}
                />
              )}

              {/* Unlimited monthly */}
              {plan.id === 'unlimited' && billing === 'monthly' && (
                <PriceHero
                  amount={`$${PRICING_USD.unlimitedMonthly.toFixed(2)}`}
                  suffix="/ mo"
                  trialLabel="1 month free"
                />
              )}
              {/* Unlimited yearly */}
              {plan.id === 'unlimited' && billing === 'yearly' && (
                <PriceHero
                  amount={`$${unlEquiv.toFixed(2)}`}
                  suffix="/ mo"
                  micro={`Billed annually · ~$${unlYearTotal.toFixed(0)} / year`}
                />
              )}

              {billing === 'yearly' && plan.id !== 'starter' && (
                <p className="mt-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0]">
                  {`Monthly equivalent — ${PRICING_USD.yearlyDiscountPercent}% less per year`}
                </p>
              )}

              <ul className="mt-8 flex-1 space-y-3 text-sm text-[#A0A0A0]">
                {plan.lines.map((line) => (
                  <li key={line} className="border-l-4 border-[#FF0000]/60 pl-3">
                    {line}
                  </li>
                ))}
              </ul>

              {plan.id === 'starter' ? (
                <a
                  href="/dashboard"
                  className={cn(
                    'mt-10 inline-flex justify-center rounded-xl py-4 text-sm font-bold transition',
                    'border border-[#121212] bg-black text-white hover:border-[#FF0000]'
                  )}
                >
                  Get started free
                </a>
              ) : userId ? (
                /* Logged-in: open Paddle checkout directly */
                <button
                  type="button"
                  onClick={() => plan.priceId && openCheckout(plan.priceId)}
                  className={cn(
                    'mt-10 inline-flex justify-center rounded-xl py-4 text-sm font-bold transition',
                    plan.highlight
                      ? 'bg-[#FF0000] text-white hover:bg-[#CC0000] neon-red-glow shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                      : 'border border-[#121212] bg-black text-white hover:border-[#FF0000]'
                  )}
                >
                  {plan.trial ? `Upgrade Free — 1 Month Free` : `Upgrade to ${plan.name}`}
                </button>
              ) : (
                /* Guest: send to login first */
                <a
                  href={`/login?next=/pricing`}
                  className={cn(
                    'mt-10 inline-flex justify-center rounded-xl py-4 text-sm font-bold transition',
                    plan.highlight
                      ? 'bg-[#FF0000] text-white hover:bg-[#CC0000] neon-red-glow shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                      : 'border border-[#121212] bg-black text-white hover:border-[#FF0000]'
                  )}
                >
                  {plan.trial ? 'Start Free Trial' : `Get ${plan.name}`}
                </a>
              )}
            </div>
          ))}
        </div>

        {billing === 'monthly' && (
          <p className="mx-auto mt-8 max-w-xl text-center text-xs font-medium text-[#A0A0A0]">
            <span className="font-bold text-white">No charge for 30 days.</span> Cancel before the trial ends and you won&apos;t be billed.
          </p>
        )}

        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-[#A0A0A0]">
          Payments are processed securely by{' '}
          <span className="font-semibold text-white">Paddle</span>. Cancel anytime from your
          billing portal.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
