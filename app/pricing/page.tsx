'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  PRICING_USD,
  yearlyMonthlyEquivalent,
  yearlyTotalUsd,
} from '@/lib/plans';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

type Billing = 'monthly' | 'yearly';

function PriceHero({
  amount,
  suffix,
  micro,
}: {
  amount: string;
  suffix: string;
  micro?: string;
}) {
  return (
    <div className="mt-6 text-left">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-[clamp(2.75rem,7vw,4rem)] font-black leading-[0.95] tracking-tighter text-white tabular-nums">
          {amount}
        </span>
        <span className="text-xs font-black uppercase tracking-[0.28em] text-[#A0A0A0]">
          {suffix}
        </span>
      </div>
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
      name: 'Ücretsiz',
      highlight: false,
      badge: null as string | null,
      lines: [
        'Ayda 10 hook üretim hakkı',
        'Tonlar: Profesyonel, Samimi, Sokak Stili',
        'Her üretimde 3 hook sonucu',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      highlight: true,
      badge: 'Popüler',
      lines: [
        'Ayda 50 hook üretim hakkı',
        'Tüm tonlar (Profesyonel … Komik)',
        'Her üretimde 5 hook',
      ],
    },
    {
      id: 'unlimited',
      name: 'Sınırsız',
      highlight: false,
      badge: null,
      lines: [
        'Sınırsız hook üretimi',
        'Tüm tonlar + yeni özelliklere öncelikli erişim',
        'Her üretimde 5 hook',
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <PublicNav />
      <main className="flex-1 px-6 pb-20 pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-display text-4xl font-black text-white sm:text-5xl">
            Paketleri <span className="text-[#FF0000]">keşfet</span>
          </h1>
          <p className="mt-4 text-[#A0A0A0]">
            Ücretsiz ile başla; Pro veya Sınırsız ile tonların tamamını ve daha fazla üretimi aç.
          </p>

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
                Aylık
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
                Yıllık
              </button>
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
              {`Yıllık ödemede %${PRICING_USD.yearlyDiscountPercent} indirim`}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-3xl border p-8',
                plan.highlight
                  ? 'border-[#FF0000] bg-[#121212] shadow-[0_0_30px_rgba(255,0,0,0.2)]'
                  : 'border-[#121212] bg-[#121212]/40'
              )}
            >
              {plan.badge && (
                <span className="absolute right-6 top-6 rounded-full bg-[#FF0000] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  {plan.badge}
                </span>
              )}
              <h2 className="font-display text-2xl font-black text-white">{plan.name}</h2>
              {plan.id === 'starter' && (
                <PriceHero amount="$0" suffix="/ ay" micro="Kredi kartı gerekmez" />
              )}
              {plan.id === 'pro' && billing === 'monthly' && (
                <PriceHero
                  amount={`$${PRICING_USD.proMonthly.toFixed(2)}`}
                  suffix="/ ay"
                />
              )}
              {plan.id === 'pro' && billing === 'yearly' && (
                <PriceHero
                  amount={`$${proEquiv.toFixed(2)}`}
                  suffix="/ ay"
                  micro={`Yıllık faturalanır · ~$${proYearTotal.toFixed(0)} / yıl`}
                />
              )}
              {plan.id === 'unlimited' && billing === 'monthly' && (
                <PriceHero
                  amount={`$${PRICING_USD.unlimitedMonthly.toFixed(2)}`}
                  suffix="/ ay"
                />
              )}
              {plan.id === 'unlimited' && billing === 'yearly' && (
                <PriceHero
                  amount={`$${unlEquiv.toFixed(2)}`}
                  suffix="/ ay"
                  micro={`Yıllık faturalanır · ~$${unlYearTotal.toFixed(0)} / yıl`}
                />
              )}
              {billing === 'yearly' && plan.id !== 'starter' && (
                <p className="mt-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0]">
                  {`Eşdeğer aylık — yıllık %${PRICING_USD.yearlyDiscountPercent} daha az`}
                </p>
              )}
              <ul className="mt-8 flex-1 space-y-3 text-sm text-[#A0A0A0]">
                {plan.lines.map((line) => (
                  <li key={line} className="border-l-4 border-[#FF0000]/60 pl-3">
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={cn(
                  'mt-10 inline-flex justify-center rounded-xl py-4 text-sm font-bold transition',
                  plan.highlight
                    ? 'bg-[#FF0000] text-white hover:bg-[#CC0000] neon-red-glow'
                    : 'border border-[#121212] bg-black text-white hover:border-[#FF0000]'
                )}
              >
                Başla
              </Link>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
