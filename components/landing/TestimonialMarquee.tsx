'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LANDING_TESTIMONIALS = [
  {
    quote:
      'İlk cümleyi 20 kez yeniden yazmak yerine saniyeler içinde güçlü varyasyonlar alıyorum — kaydırma gerçekten duruyor.',
    name: 'Sarah Mitchell',
    role: 'Content Creator',
  },
  {
    quote:
      'LinkedIn ve X için tonları ayırabilmek iş akışımızı hızlandırdı; iç onay süremiz yarı yarıya kısaldı.',
    name: 'James Porter',
    role: 'Growth Lead',
  },
  {
    quote:
      'Ürün videolarında “sıradan giriş” sorunumuz vardı. Açılış cümleleri artık çok daha keskin.',
    name: 'Emily Carter',
    role: 'Brand Manager',
  },
  {
    quote:
      'Solo creator olarak script başına harcadığım zaman dramatik şekilde azaldı; hook kalitesi stabil.',
    name: 'Marcus Webb',
    role: 'YouTube Creator',
  },
  {
    quote:
      'Ekibim brief’ten çıkan ilk satırı tartışmak yerine doğrudan performansa odaklanıyor.',
    name: 'Olivia Hayes',
    role: 'Social Media Director',
  },
  {
    quote:
      'Shorts ve Reels için farklı enerji seviyelerinde çıktı almak işimize tam oturdu.',
    name: 'Daniel Brooks',
    role: 'Performance Marketer',
  },
  {
    quote:
      'Kampanya mesajlarında A/B test için çok sayıda hook üretmek artık dakikalar sürmüyor.',
    name: 'Rachel Chen',
    role: 'Demand Gen Manager',
  },
  {
    quote:
      'Ajans müşterilerimize sunum öncesi “hook duvarı” çıkarıyoruz; müşteri tepkisi çok olumlu.',
    name: 'Thomas Reed',
    role: 'Creative Strategist',
  },
  {
    quote:
      'Teknik ürünleri sıkıcı anlatmak zorundaydık; motor merak uyandıran açılışlar üretiyor.',
    name: 'Nina Patel',
    role: 'Product Marketing',
  },
  {
    quote:
      'Ücretsiz paketle bile günlük işimi görüyorum; yükseltme net bir sonraki adım.',
    name: 'Chris Dalton',
    role: 'Indie Founder',
  },
] as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function TestimonialCard({ t }: { t: (typeof LANDING_TESTIMONIALS)[number] }) {
  return (
    <article className="group/card w-[min(100vw-3rem,22rem)] shrink-0 rounded-3xl border border-[#121212] bg-[#121212]/35 p-7 transition duration-300 hover:border-[#FF0000]/35 hover:shadow-[0_0_32px_rgba(255,0,0,0.08)] sm:w-[24rem]">
      <Quote className="h-8 w-8 text-[#FF0000]/80" strokeWidth={1.25} />
      <p className="mt-5 text-sm leading-relaxed text-[#A0A0A0] transition group-hover/card:text-white">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 border-t border-black pt-5">
        <p className="text-sm font-extrabold text-white">{t.name}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">{t.role}</p>
      </div>
    </article>
  );
}

export function TestimonialMarquee({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className={cn('mx-auto max-w-6xl', className)}>
        <div className="flex flex-wrap justify-center gap-6">
          {LANDING_TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-20"
        aria-hidden
      />

      <div className="testimonial-marquee-wrap overflow-hidden">
        <div className="testimonial-marquee-track flex w-max">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 gap-6 px-3 sm:gap-8 sm:px-4"
              aria-hidden={dup === 1}
            >
              {LANDING_TESTIMONIALS.map((t) => (
                <TestimonialCard key={`${dup}-${t.name}`} t={t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
