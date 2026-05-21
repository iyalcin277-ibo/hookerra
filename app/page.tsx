import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Layers3,
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

const features = [
  {
    icon: Zap,
    title: 'AI ile anında hook üret',
    body: 'Konunu yaz; motor saniyeler içinde ilk 3 saniyeye göre optimize edilmiş varyasyonlar çıkarır.',
  },
  {
    icon: Target,
    title: 'Viral odaklı içerik',
    body: 'Merak, gerilim ve netlik — sıradan anlatımı değil, durdurmayı hedefleyen cümleleri üret.',
  },
  {
    icon: Layers3,
    title: 'Platforma özel ton seçimi',
    body: 'Profesyonelden agresife kadar tonları seç; içeriğin kanalına göre doğru sesi yakalarsın.',
  },
];

const comparisonRows = [
  { other: 'Genel prompt ile şansa bağlı çıktı', hookerra: 'Hook odaklı yapı ve tutarlı JSON çıktı' },
  { other: 'Uzun metin, dağınık fikirler', hookerra: 'İlk satırda tutturmayı hedefleyen kısa hooklar' },
  { other: 'Tek varyasyon', hookerra: 'Her üretimde çoklu seçenek — kopyala ve test et' },
];

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white">
      <PublicNav />

      <main className="flex-1 pt-14">
        {/* HERO */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pb-28 sm:pt-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-10%,_rgba(255,0,0,0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-w-xl bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.06),_transparent_65%)] blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#121212] bg-[#121212]/70 px-4 py-2 transition hover:border-[#FF0000]/35">
                <Sparkles className="h-4 w-4 text-[#FF0000]" strokeWidth={2} />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#A0A0A0]">
                  AI hook motoru
                </span>
              </div>

              <h1 className="max-w-xl font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
                İzlenmeyen içerikleri viral hooklara çevir.
              </h1>

              <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-[#A0A0A0]">
                Hookerra, AI destekli hook motoruyla saniyeler içinde dikkat çeken içerikler üretir.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/dashboard" className="sm:w-auto">
                  <Button className="group inline-flex w-full items-center gap-2 px-8 py-4 text-base font-extrabold sm:w-auto">
                    Hemen Hook Oluştur
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" strokeWidth={2} />
                  </Button>
                </Link>
                <Link href="/#nasil-calisir" className="sm:w-auto">
                  <button
                    type="button"
                    className={cn(
                      'w-full rounded-xl border border-[#121212] bg-[#121212]/40 px-8 py-4 text-base font-extrabold text-white',
                      'transition hover:border-[#FF0000]/45 hover:bg-[#121212] hover:shadow-[0_0_24px_rgba(255,0,0,0.12)] sm:w-auto'
                    )}
                  >
                    Nasıl Çalışır
                  </button>
                </Link>
              </div>

              <p className="mt-8 text-sm font-medium text-[#A0A0A0]">
                Ücretsiz başla ·{' '}
                <Link href="/pricing" className="text-[#FF0000] underline-offset-4 hover:underline">
                  Pro ile daha fazla üretim
                </Link>
              </p>
            </div>

            <BeforeAfterCard className="lg:justify-self-end" />
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-y border-[#121212] bg-black px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
                <div className="text-center md:text-left">
                  <p className="font-sans text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
                    100.000+
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-[#A0A0A0]">
                    içerik üretildi
                  </p>
                </div>
                <div className="hidden h-14 w-px bg-[#121212] md:block" aria-hidden />
                <div className="text-center md:text-left">
                  <p className="font-sans text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
                    30.000+
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-[#A0A0A0]">
                    kullanıcı
                  </p>
                </div>
                <div className="hidden h-14 w-px bg-[#121212] md:block" aria-hidden />
                <div className="max-w-md text-center md:text-left">
                  <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#FF0000] neon-red-text">
                    Güven
                  </p>
                  <p className="mt-2 text-base font-medium leading-relaxed text-[#A0A0A0]">
                    Üreticiler ve markalar ilk üç saniyede kazanmak için Hookerra ile önce hook’u
                    netleştiriyor.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="font-sans text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                Kimse sıkıcı içerik izlemiyor.
              </p>
              <p className="mt-8 font-sans text-3xl font-extrabold leading-tight text-[#FF0000] neon-red-text sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                İlk 3 saniyede kaybediyorsun.
              </p>
              <p className="mx-auto mt-10 max-w-xl text-base font-medium leading-relaxed text-[#A0A0A0]">
                Kaydırmayı durdurmak için mükemmel kurgu yetmez — ilk cümle güçlü olmalı. Hookerra bu
                yüzden var.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-[#121212] bg-[#0a0a0a] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#FF0000]">
                  Çözüm
                </p>
                <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Viral odaklı üretim — tek ekranda.
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} className={i === 1 ? 'md:mt-8' : ''}>
                  <div className="group flex h-full flex-col rounded-3xl border border-[#121212] bg-[#121212]/40 p-8 transition duration-300 hover:border-[#FF0000]/30 hover:shadow-[0_0_28px_rgba(255,0,0,0.06)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF0000]/25 bg-[#FF0000]/10 text-[#FF0000] transition group-hover:border-[#FF0000]/55 group-hover:shadow-[0_0_22px_rgba(255,0,0,0.35)]">
                      <f.icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mt-6 font-sans text-xl font-extrabold text-white">{f.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#A0A0A0]">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="nasil-calisir" className="scroll-mt-20 px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Nasıl <span className="text-[#FF0000] neon-red-text">çalışır?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Üç adım. Dakikalar değil, saniyeler.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                { step: '01', title: 'Konunu yaz', body: 'Ürün, fikir veya video özeti — net olması yeterli.' },
                { step: '02', title: 'Tonunu seç', body: 'Kanalına uygun sesi seç; varyasyonlar ona göre şekillenir.' },
                { step: '03', title: 'Hook’u al', body: 'Birden fazla seçenek — kopyala, paylaş veya A/B test et.' },
              ].map((item, i) => (
                <Reveal key={item.step} className={i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-20' : ''}>
                  <div className="relative overflow-hidden rounded-3xl border border-[#121212] bg-[#121212]/35 p-8 transition hover:border-[#FF0000]/35">
                    <span className="font-mono text-xs font-bold text-[#FF0000]">{item.step}</span>
                    <h3 className="mt-4 font-sans text-xl font-extrabold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{item.body}</p>
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FF0000]/5 blur-2xl" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY HOOKERRA */}
        <section className="border-t border-[#121212] px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="text-center">
                <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Neden <span className="text-[#FF0000]">Hookerra?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Diğerleri genel metin üretir; Hookerra ilk satırı kazanmak için optimize eder.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <div className="overflow-hidden rounded-3xl border border-[#121212] bg-[#121212]/25">
                <div className="grid grid-cols-2 border-b border-black bg-black/80">
                  <div className="px-5 py-4 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#A0A0A0]">
                    Diğerleri
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

        {/* TESTIMONIALS */}
        <section
          id="yorumlar"
          className="scroll-mt-20 border-t border-[#121212] bg-[#050505] px-6 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#FF0000]">
                  Topluluk
                </p>
                <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ne <span className="text-[#FF0000] neon-red-text">söylüyorlar?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-[#A0A0A0]">
                  Üreticiler ve ekipler ilk üç saniyede fark yaratmak için Hookerra kullanıyor.
                </p>
              </div>
            </Reveal>
            <TestimonialMarquee className="mt-10 sm:mt-12" />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden border-t border-[#121212] px-6 py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.14),_transparent_60%)]" />
          <Reveal className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-sans text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
              Hâlâ izlenmeyen içerik mi üreteceksin?
            </h2>
            <Link href="/dashboard" className="mt-12 inline-block">
              <Button className="px-12 py-5 text-lg font-extrabold neon-red-glow shadow-[0_0_40px_rgba(255,0,0,0.25)] transition hover:scale-[1.02] active:scale-[0.98]">
                Hemen Başla
              </Button>
            </Link>
            <p className="mt-8 text-sm font-medium text-[#A0A0A0]">
              Kredi kartı gerekmez ·{' '}
              <Link href="/login" className="text-white underline-offset-4 hover:underline">
                Giriş yap
              </Link>
            </p>
          </Reveal>
        </section>
      </main>

      <PublicFooter logoHref="/" />
    </div>
  );
}
