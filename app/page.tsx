import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Check,
  FileText,
  Hash,
  MessageSquare,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { BeforeAfterCard } from '@/components/landing/BeforeAfterCard';
import { Reveal } from '@/components/landing/Reveal';
import { TestimonialMarquee } from '@/components/landing/TestimonialMarquee';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PIPELINE_STAGES = [
  {
    num: '01',
    icon: Zap,
    title: 'Hook',
    desc: 'Thumb-stopping openers engineered for the first 3 seconds — curiosity, shock, or pain point.',
    tag: 'Scroll stopper',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Script',
    desc: 'Scene-by-scene short-form video scripts for Reels, TikTok & Shorts with B-roll notes.',
    tag: 'Retention engine',
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'Caption',
    desc: 'Persuasive post copy that drives saves, shares, and comments — value-first, algorithm-friendly.',
    tag: 'Engagement driver',
  },
  {
    num: '04',
    icon: Target,
    title: 'CTA',
    desc: 'High-conversion calls-to-action that turn passive viewers into followers, leads, and buyers.',
    tag: 'Conversion layer',
  },
  {
    num: '05',
    icon: Hash,
    title: 'Hashtags',
    desc: 'Targeted semantic tags — broad, niche, and trending — to maximize organic discovery.',
    tag: 'Reach amplifier',
  },
  {
    num: '06',
    icon: Calendar,
    title: 'Content Plan',
    desc: 'A full posting calendar with daily themes, formats, and optimal publishing times.',
    tag: 'Strategy layer',
  },
];

const comparisonRows = [
  { other: 'One generic text block per prompt', hookerra: 'Six distinct, ready-to-publish assets in one generation' },
  { other: 'You still have to write the script, caption, and CTA manually', hookerra: 'Hook → Script → Caption → CTA → Hashtags → Plan — all at once' },
  { other: 'No posting strategy, no calendar', hookerra: 'Built-in content plan with daily schedule and format guidance' },
];

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white">
      <PublicNav />

      <main className="flex-1 pt-14">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pb-28 sm:pt-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-10%,_rgba(255,0,0,0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-w-xl bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.06),_transparent_65%)] blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#FF0000]" strokeWidth={2} />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FF0000]">
                  AI Content Production Factory
                </span>
              </div>

              <h1 className="max-w-xl font-sans text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Stop the scroll.{' '}
                <span className="text-[#FF0000] neon-red-text">Own the feed.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-[#A0A0A0]">
                From a killer hook to a complete viral content plan — six AI-powered assets generated in seconds. One topic. Total content domination.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/dashboard" className="sm:w-auto">
                  <Button className="group inline-flex w-full items-center gap-2 px-8 py-4 text-base font-extrabold sm:w-auto">
                    Launch Content Factory
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" strokeWidth={2} />
                  </Button>
                </Link>
                <Link href="/#pipeline" className="sm:w-auto">
                  <button
                    type="button"
                    className={cn(
                      'w-full rounded-xl border border-[#121212] bg-[#121212]/40 px-8 py-4 text-base font-extrabold text-white',
                      'transition hover:border-[#FF0000]/45 hover:bg-[#121212] hover:shadow-[0_0_24px_rgba(255,0,0,0.12)] sm:w-auto'
                    )}
                  >
                    See the Pipeline
                  </button>
                </Link>
              </div>

              <p className="mt-8 text-sm font-medium text-[#A0A0A0]">
                Free to start ·{' '}
                <Link href="/pricing" className="text-[#FF0000] underline-offset-4 hover:underline">
                  1 month free on Pro &amp; Unlimited
                </Link>
              </p>
            </div>

            <BeforeAfterCard className="lg:justify-self-end" />
          </div>
        </section>

        {/* ── SOCIAL PROOF ─────────────────────────────────────── */}
        <section className="border-y border-[#121212] bg-black px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
                <div className="text-center md:text-left">
                  <p className="font-sans text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
                    100,000+
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-[#A0A0A0]">
                    content assets generated
                  </p>
                </div>
                <div className="hidden h-14 w-px bg-[#121212] md:block" aria-hidden />
                <div className="text-center md:text-left">
                  <p className="font-sans text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
                    30,000+
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-[#A0A0A0]">
                    creators &amp; brands
                  </p>
                </div>
                <div className="hidden h-14 w-px bg-[#121212] md:block" aria-hidden />
                <div className="max-w-md text-center md:text-left">
                  <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
                    Trusted
                  </p>
                  <p className="mt-2 text-base font-medium leading-relaxed text-[#A0A0A0]">
                    Creators and brands use Hookerra to generate an entire content strategy — not just an opening line.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── THE CONTENT FACTORY PIPELINE ─────────────────────── */}
        <section id="pipeline" className="scroll-mt-20 border-t border-[#121212] bg-[#050505] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#FF0000]">
                  The Content Factory
                </p>
                <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  One topic.{' '}
                  <span className="text-[#FF0000] neon-red-text">Six AI-powered assets.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Every generation produces a complete content production package — ready to copy, post, and schedule.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PIPELINE_STAGES.map((stage, i) => (
                <Reveal key={stage.num} className={i === 1 || i === 4 ? 'sm:mt-6' : ''}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#121212] bg-[#121212]/40 p-7 transition duration-300 hover:border-[#FF0000]/40 hover:shadow-[0_0_28px_rgba(255,0,0,0.08)]">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#FF0000]/5 blur-2xl transition duration-300 group-hover:bg-[#FF0000]/12" />
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#FF0000]">{stage.num}</span>
                      <span className="rounded-full border border-[#FF0000]/20 bg-[#FF0000]/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#FF0000]">
                        {stage.tag}
                      </span>
                    </div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FF0000]/25 bg-[#FF0000]/10 text-[#FF0000] transition group-hover:border-[#FF0000]/55 group-hover:shadow-[0_0_18px_rgba(255,0,0,0.3)]">
                      <stage.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="font-sans text-xl font-extrabold text-white">{stage.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#A0A0A0]">{stage.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 text-center">
              <Link href="/dashboard">
                <Button className="inline-flex items-center gap-2 px-8 py-4 text-base font-extrabold">
                  Generate All 6 Assets Now
                  <ArrowRight className="h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="font-sans text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                Nobody watches boring content.
              </p>
              <p className="mt-8 font-sans text-3xl font-extrabold leading-tight text-[#FF0000] neon-red-text sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                You lose them in the first 3 seconds.
              </p>
              <p className="mx-auto mt-10 max-w-xl text-base font-medium leading-relaxed text-[#A0A0A0]">
                Great editing isn&apos;t enough — your hook, script, caption, and CTA all have to work together. Hookerra builds the entire content stack for you, instantly.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WHY HOOKERRA ─────────────────────────────────────── */}
        <section className="border-t border-[#121212] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="text-center">
                <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Why <span className="text-[#FF0000]">Hookerra?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Other tools give you a sentence. Hookerra gives you an entire content production package.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <div className="overflow-hidden rounded-3xl border border-[#121212] bg-[#121212]/25">
                <div className="grid grid-cols-2 border-b border-black bg-black/80">
                  <div className="px-5 py-4 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#A0A0A0]">
                    Others
                  </div>
                  <div className="border-l border-black px-5 py-4 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
                    Hookerra
                  </div>
                </div>
                {comparisonRows.map((row) => (
                  <div
                    key={row.other}
                    className="grid grid-cols-2 border-t border-black text-sm transition hover:bg-[#FF0000]/5"
                  >
                    <div className="flex gap-3 px-5 py-5 text-[#A0A0A0]">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-[#A0A0A0]/70" strokeWidth={2} />
                      <span>{row.other}</span>
                    </div>
                    <div className="flex gap-3 border-l border-black px-5 py-5 font-semibold text-white">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF0000]" strokeWidth={2} />
                      <span>{row.hookerra}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section
          id="testimonials"
          className="scroll-mt-20 border-t border-[#121212] bg-[#050505] px-6 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#FF0000]">
                  Community
                </p>
                <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  What are they <span className="text-[#FF0000] neon-red-text">saying?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Creators and teams use Hookerra to dominate feeds — from the first hook to the full content calendar.
                </p>
              </div>
            </Reveal>
            <TestimonialMarquee className="mt-10 sm:mt-12" />
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-[#121212] px-6 py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.14),_transparent_60%)]" />
          <Reveal className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-sans text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
              Ready to run your own content factory?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base font-medium text-[#A0A0A0]">
              Hook, Script, Caption, CTA, Hashtags, Content Plan — all six assets from a single prompt.
            </p>
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-5 py-2">
              <Sparkles className="h-4 w-4 text-[#FF0000]" strokeWidth={2} />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF0000]">
                First month free on Pro &amp; Unlimited
              </span>
            </div>
            <Link href="/dashboard" className="mt-6 inline-block">
              <Button className="px-12 py-5 text-lg font-extrabold neon-red-glow shadow-[0_0_40px_rgba(255,0,0,0.25)] transition hover:scale-[1.02] active:scale-[0.98]">
                Launch Free — No Card Needed
              </Button>
            </Link>
            <p className="mt-8 text-sm font-medium text-[#A0A0A0]">
              No credit card required ·{' '}
              <Link href="/pricing" className="text-[#FF0000] underline-offset-4 hover:underline">
                See all plans
              </Link>
              {' '}·{' '}
              <Link href="/login" className="text-white underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </Reveal>
        </section>
      </main>

      <PublicFooter logoHref="/" />
    </div>
  );
}
