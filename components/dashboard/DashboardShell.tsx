'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Check,
  Copy,
  Loader2,
  Lock,
  LogOut,
  Sparkles,
  History as HistoryIcon,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ALL_TONES,
  hooksPerResponse,
  isToneUnlockedForTier,
  monthlyGenerationLimit,
  normalizeTier,
  planDisplayName,
  startOfUtcMonthIso,
  type TierId,
  type HookTone,
} from '@/lib/plans';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';

type Platform = 'X' | 'LinkedIn';
type NavKey = 'create' | 'profile' | 'archive';

interface GenerationRow {
  id: string;
  input_text: string;
  tone: string | null;
  platform: string | null;
  ai_output: { hooks?: string[] };
  created_at: string;
}

export function DashboardShell() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [nav, setNav] = useState<NavKey>('create');
  const [tier, setTier] = useState<TierId>('starter');
  const [usedThisMonth, setUsedThisMonth] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<HookTone>('Profesyonel');
  const [platform, setPlatform] = useState<Platform>('X');
  const [hooks, setHooks] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationRow[]>([]);
  const [planSaving, setPlanSaving] = useState(false);

  const limit = monthlyGenerationLimit(tier);
  const usageLabel =
    limit === 'unlimited'
      ? 'Sınırsız kullanım'
      : `${usedThisMonth} / ${limit} bu ay`;

  const loadSubscription = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setEmail(user.email ?? null);
    setUserId(user.id);
    setUserCreatedAt(user.created_at ?? null);

    const { data: prof } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .maybeSingle();

    const t = normalizeTier(prof?.subscription_status as string | undefined);
    setTier(t);

    const { count } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfUtcMonthIso());

    setUsedThisMonth(count ?? 0);
  }, [supabase]);

  const loadHistory = useCallback(async () => {
    const { data, error: qErr } = await supabase
      .from('generations')
      .select('id,input_text,tone,platform,ai_output,created_at')
      .order('created_at', { ascending: false })
      .limit(30);
    if (!qErr && data) setHistory(data as GenerationRow[]);
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      setReady(true);
      await loadSubscription();
      await loadHistory();
    })();
    return () => {
      cancelled = true;
    };
  }, [router, supabase, loadHistory, loadSubscription]);

  function showToast(msg: string, durationMs = 2200) {
    setToast(msg);
    setTimeout(() => setToast(null), durationMs);
  }

  async function generate() {
    if (!topic.trim()) return;
    if (tier === 'starter' && !isToneUnlockedForTier(tier, tone)) {
      setError(
        'Bu ton Pro veya Sınırsız pakette. Üretmek için paketini yükselt.'
      );
      showToast('Paketini yükselt — kilitli tonlar için Pro veya Sınırsız gerekir.', 4200);
      return;
    }
    setLoading(true);
    setError(null);
    setHooks([]);
    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), tone, platform }),
      });
      const data = (await res.json()) as {
        hooks?: string[];
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'İstek başarısız.');
        return;
      }
      if (data.hooks?.length) {
        setHooks(data.hooks);
        showToast('Hooklar hazır.');
        await loadHistory();
        await loadSubscription();
      }
    } catch {
      setError('Ağ hatası.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
    router.refresh();
  }

  async function setSubscription(next: TierId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setPlanSaving(true);
    try {
      const status =
        next === 'unlimited'
          ? 'unlimited'
          : next === 'pro'
            ? 'pro'
            : 'starter';
      const { error: upErr } = await supabase
        .from('profiles')
        .update({ subscription_status: status })
        .eq('id', user.id);
      if (upErr) {
        showToast(upErr.message.slice(0, 120));
        return;
      }
      setTier(next);
      showToast('Paket güncellendi.');
      await loadSubscription();
    } finally {
      setPlanSaving(false);
    }
  }

  function copyOne(text: string, idx: number) {
    void navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Kopyalandı!');
    setTimeout(() => setCopiedIdx(null), 1800);
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-9 w-9 animate-spin text-[#FF0000]" strokeWidth={1.5} />
      </div>
    );
  }

  const sidebarNav: { key: NavKey; label: string; icon: ReactNode }[] = [
    { key: 'create', label: 'Hook oluştur', icon: <Zap className="h-5 w-5" strokeWidth={1.5} /> },
    { key: 'profile', label: 'Profil', icon: <UserIcon className="h-5 w-5" strokeWidth={1.5} /> },
    { key: 'archive', label: 'Arşiv', icon: <HistoryIcon className="h-5 w-5" strokeWidth={1.5} /> },
  ];

  const skeletonCount = hooksPerResponse(tier);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="flex w-full shrink-0 flex-col border-b border-[#121212] bg-[#121212] md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-black p-4">
          <Link href="/dashboard" className="flex justify-center py-2">
            <Logo className="h-8 w-auto text-white" />
          </Link>
        </div>

        <nav className="flex flex-row gap-1 overflow-x-auto p-3 md:flex-col md:overflow-visible">
          {sidebarNav.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setNav(item.key)}
              className={cn(
                'flex min-w-[120px] shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest transition md:min-w-0',
                nav === item.key
                  ? 'bg-black text-[#FF0000]'
                  : 'text-[#A0A0A0] hover:bg-black/60 hover:text-white'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-black p-4 md:border-t md:px-3 md:pt-4 md:pb-2">
          <div className="rounded-2xl border border-[#121212] bg-black/60 p-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">
              Paket
            </p>
            <p className="mt-1 font-display text-lg font-black text-[#FF0000]">
              {planDisplayName(tier)}
            </p>
            <p className="mt-2 text-xs font-semibold text-white">{usageLabel}</p>
            {tier === 'starter' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                Ayda 10 üretim • gösterim başına 3 hook
              </p>
            )}
            {tier === 'pro' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                Ayda 50 üretim • 5 hook
              </p>
            )}
            {tier === 'unlimited' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                Sınırsız üretim • 5 hook • öncelikli özellikler
              </p>
            )}
          </div>
          {tier === 'starter' && (
            <Link
              href="/pricing"
              className="mt-4 flex flex-col gap-2 rounded-2xl border border-[#FF0000]/55 bg-[#FF0000]/10 p-4 transition hover:border-[#FF0000] hover:bg-[#FF0000]/15"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0000]">
                Paketini yükselt
              </span>
              <span className="text-xs font-semibold leading-snug text-white">
                Tüm tonları üretimde kullan, ayda daha fazla hak ve 5 hook sonucu için Pro veya Sınırsız.
              </span>
              <span className="text-[11px] font-bold text-[#FF0000]">
                Fiyatları gör →
              </span>
            </Link>
          )}
        </div>

        <div className="mt-auto border-t border-black p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#121212] px-3 py-3 text-xs font-bold uppercase tracking-widest text-[#A0A0A0] transition hover:border-[#FF0000] hover:text-white"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[#121212] px-4 py-3 md:hidden">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#A0A0A0]">
              {planDisplayName(tier)}
            </p>
            <p className="truncate text-xs font-bold text-white">{usageLabel}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setNav('profile')}
              className={cn(
                'rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-wider',
                nav === 'profile' ? 'bg-[#FF0000] text-white' : 'text-[#A0A0A0]'
              )}
            >
              Profil
            </button>
            <button
              type="button"
              onClick={() => setNav('archive')}
              className={cn(
                'rounded-lg px-2 py-2 text-[10px] font-bold uppercase tracking-wider',
                nav === 'archive' ? 'bg-[#FF0000] text-white' : 'text-[#A0A0A0]'
              )}
            >
              Arşiv
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[#121212] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]"
            >
              Çıkış
            </button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {nav === 'create' && (
            <>
              <section className="flex w-full flex-col border-b border-[#121212] p-6 lg:w-[400px] lg:border-b-0 lg:border-r lg:overflow-y-auto">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Konun nedir?
                </label>
                <Textarea
                  className="mt-3 min-h-[140px]"
                  placeholder="Kısa ve net yaz — hedef kitleni düşün."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                <p className="mt-8 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Ton
                </p>
                <p className="mt-1 text-[11px] text-[#A0A0A0]">
                  Tüm tonları seçebilirsin. Ücretsiz pakette kilitli tonlar için üret dediğinde paket
                  yükseltmen istenir (üzerinde kilit simgesi).
                </p>
                <div className="mt-3 grid gap-2">
                  {ALL_TONES.map((t) => {
                    const lockedPremium =
                      tier === 'starter' && !isToneUnlockedForTier(tier, t);
                    const selected = tone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={cn(
                          'flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-xs font-bold transition',
                          selected
                            ? lockedPremium
                              ? 'border-[#FF0000] bg-black text-white ring-2 ring-[#FF0000]/35'
                              : 'border-[#FF0000] bg-black text-white neon-red-glow'
                            : lockedPremium
                              ? 'border-[#121212] bg-[#121212]/45 text-[#A0A0A0] hover:border-[#FF0000]/35'
                              : 'border-[#121212] bg-[#121212]/60 text-[#A0A0A0] hover:border-[#FF0000]/40'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {lockedPremium && (
                            <Lock className="h-4 w-4 shrink-0 text-[#FF0000]" strokeWidth={1.5} />
                          )}
                          {t}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-8 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Platform
                </p>
                <div className="mt-3 flex gap-2">
                  {(['X', 'LinkedIn'] as Platform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={cn(
                        'flex-1 rounded-xl border px-3 py-3 text-xs font-bold transition',
                        platform === p
                          ? 'border-[#FF0000] bg-black text-white'
                          : 'border-[#121212] bg-[#121212]/60 text-[#A0A0A0]'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  className="mt-10 w-full py-4 text-sm font-black uppercase tracking-widest"
                  disabled={loading || !topic.trim()}
                  onClick={generate}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={1.5} />
                      Üretiliyor…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" strokeWidth={1.5} />
                      Üret ({hooksPerResponse(tier)} hook)
                    </>
                  )}
                </Button>

                {error && (
                  <p className="mt-4 text-xs font-semibold text-[#fecaca]">{error}</p>
                )}
              </section>

              <section className="flex flex-1 flex-col overflow-y-auto bg-black p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-black text-white">Sonuçlar</h2>
                    <p className="mt-1 text-[11px] text-[#A0A0A0]">
                      Bu pakette en fazla {hooksPerResponse(tier)} hook gösterilir.
                    </p>
                  </div>
                  {hooks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(hooks.join('\n\n'));
                        showToast('Tümü kopyalandı!');
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#FF0000] hover:text-white"
                    >
                      Tümünü kopyala
                    </button>
                  )}
                </div>

                {loading && hooks.length === 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                      <div
                        key={i}
                        className="h-24 animate-pulse rounded-2xl border border-[#121212] bg-[#121212]/60"
                      />
                    ))}
                  </div>
                ) : hooks.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#121212] p-10 text-center">
                    <Sparkles className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />
                    <p className="max-w-sm text-sm text-[#A0A0A0]">
                      Konunu yazıp üret; hooklar burada listelenir.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {hooks.map((h, i) => (
                      <li
                        key={i}
                        className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6 pl-5"
                        style={{ borderLeftWidth: 4, borderLeftColor: '#FF0000' }}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <p className="flex-1 text-base font-semibold leading-relaxed text-white">
                            {h}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyOne(h, i)}
                            className={cn(
                              'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[10px] font-black uppercase tracking-widest transition',
                              copiedIdx === i
                                ? 'border-[#FF0000] bg-black text-[#FF0000]'
                                : 'border-[#121212] bg-black text-white hover:border-[#FF0000]'
                            )}
                          >
                            {copiedIdx === i ? (
                              <>
                                <Check className="h-4 w-4" strokeWidth={1.5} />
                                Kopyalandı!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" strokeWidth={1.5} />
                                Kopyala
                              </>
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}

          {nav === 'profile' && (
            <section className="flex-1 space-y-8 overflow-y-auto p-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">Profil</h2>
                <p className="mt-1 text-sm text-[#A0A0A0]">
                  Hesap, paket özeti ve yükseltme
                </p>
              </div>

              <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Hesap bilgileri
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                      E-posta
                    </dt>
                    <dd className="mt-1 font-medium text-white">{email ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                      Kullanıcı ID
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-[#A0A0A0]">
                      {userId ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                      Üyelik tarihi
                    </dt>
                    <dd className="mt-1 text-white">
                      {userCreatedAt
                        ? new Date(userCreatedAt).toLocaleString('tr-TR')
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Paket bilgisi
                </p>
                <p className="mt-3 font-display text-2xl font-black text-[#FF0000]">
                  {planDisplayName(tier)}
                </p>
                <p className="mt-2 text-sm text-white">{usageLabel}</p>
                <ul className="mt-4 space-y-2 text-xs text-[#A0A0A0]">
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">
                    Aylık üretim limiti:{' '}
                    {limit === 'unlimited' ? 'Sınırsız' : `${limit} üretim`}
                  </li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">
                    Her üretimde gösterilen hook: {hooksPerResponse(tier)} adet
                  </li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">
                    Tonlar:{' '}
                    {tier === 'starter'
                      ? 'Profesyonel, Samimi, Sokak Stili (üretimde); diğerleri yükseltme ile'
                      : 'Tüm tonlar (Profesyonel … Komik)'}
                  </li>
                </ul>
              </div>

              {tier === 'starter' && (
                <div className="rounded-2xl border border-[#FF0000]/45 bg-[#FF0000]/10 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0000]">
                    Paket yükselt
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Pro veya Sınırsız ile kilitli tonlarda üret, daha fazla aylık hak ve 5 hook sonucu
                    al.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-4 inline-flex rounded-xl bg-[#FF0000] px-5 py-3 text-xs font-black uppercase tracking-widest text-white neon-red-glow hover:bg-[#CC0000]"
                  >
                    Paketini yükselt
                  </Link>
                </div>
              )}

              <div className="rounded-2xl border border-[#121212] bg-black/40 p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A0A0A0]">
                  Paket seçimi (demo)
                </p>
                <p className="mt-2 text-sm text-[#A0A0A0]">
                  Ödeme bağlı değilken test için paketi buradan değiştirebilirsin.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(['starter', 'pro', 'unlimited'] as TierId[]).map((tid) => (
                    <button
                      key={tid}
                      type="button"
                      disabled={planSaving || tier === tid}
                      onClick={() => setSubscription(tid)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-widest transition',
                        tier === tid
                          ? 'border-[#FF0000] bg-black text-[#FF0000]'
                          : 'border-[#121212] bg-black text-white hover:border-[#FF0000]'
                      )}
                    >
                      {planDisplayName(tid)}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/pricing"
                className="inline-flex rounded-xl border border-[#FF0000]/50 px-5 py-3 text-sm font-bold text-[#FF0000] hover:bg-[#FF0000]/10"
              >
                Fiyatlandırma sayfası →
              </Link>
            </section>
          )}

          {nav === 'archive' && (
            <section className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <h2 className="font-display text-2xl font-black text-white">Arşiv</h2>
              <p className="mt-2 text-sm text-[#A0A0A0]">Kayıtlı üretimler</p>
              <div className="mt-8 space-y-4">
                {history.length === 0 ? (
                  <p className="text-sm text-[#A0A0A0]">Henüz kayıt yok.</p>
                ) : (
                  history.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                        <span className="text-[#FF0000]">{row.tone ?? '—'}</span>
                        <span>{new Date(row.created_at).toLocaleString('tr-TR')}</span>
                      </div>
                      <p className="mt-2 text-sm text-white">{row.input_text}</p>
                      <ul className="mt-3 space-y-2">
                        {(row.ai_output?.hooks ?? []).map((h, idx) => (
                          <li
                            key={idx}
                            className="flex items-start justify-between gap-3 rounded-xl border border-black bg-black/40 p-3 text-xs text-[#A0A0A0]"
                          >
                            <span className="text-white/90">{h}</span>
                            <button
                              type="button"
                              onClick={() => copyOne(h, idx)}
                              className="shrink-0 text-[#FF0000] hover:text-white"
                            >
                              <Copy className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 rounded-2xl border border-[#FF0000]/40 bg-black px-6 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#FF0000] neon-red-glow">
          {toast}
        </div>
      )}
    </div>
  );
}
