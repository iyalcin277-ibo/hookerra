'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LANDING_TESTIMONIALS = [
  {
    quote:
      'Instead of rewriting the first sentence 20 times, I get strong variations in seconds — the scroll actually stops.',
    name: 'Sarah Mitchell',
    role: 'Content Creator',
  },
  {
    quote:
      'Being able to separate tones for LinkedIn and X sped up our workflow; our internal approval time was cut in half.',
    name: 'James Porter',
    role: 'Growth Lead',
  },
  {
    quote:
      'We had a "boring opener" problem with product videos. Opening lines are so much sharper now.',
    name: 'Emily Carter',
    role: 'Brand Manager',
  },
  {
    quote:
      'As a solo creator, the time I spent per script dropped dramatically — and hook quality stays consistent.',
    name: 'Marcus Webb',
    role: 'YouTube Creator',
  },
  {
    quote:
      'My team focuses directly on performance instead of debating the first line from the brief.',
    name: 'Olivia Hayes',
    role: 'Social Media Director',
  },
  {
    quote:
      'Getting output at different energy levels for Shorts and Reels fits our workflow perfectly.',
    name: 'Daniel Brooks',
    role: 'Performance Marketer',
  },
  {
    quote:
      'Generating a large batch of hooks for A/B testing campaign messages no longer takes hours.',
    name: 'Rachel Chen',
    role: 'Demand Gen Manager',
  },
  {
    quote:
      'We put a "hook wall" in front of agency clients before presentations; client reaction has been very positive.',
    name: 'Thomas Reed',
    role: 'Creative Strategist',
  },
  {
    quote:
      'We used to struggle to make technical products sound exciting; the engine generates curiosity-driven openers.',
    name: 'Nina Patel',
    role: 'Product Marketing',
  },
  {
    quote:
      'Even the free plan handles my daily needs; upgrading is a clear next step.',
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
