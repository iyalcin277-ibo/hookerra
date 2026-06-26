'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Hash,
  Loader2,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Sparkles,
  History as HistoryIcon,
  Target,
  User as UserIcon,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ALL_TONES,
  contentGenSettings,
  resolveCTACount,
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
import type { ContentPack } from '@/lib/plans';

type NavKey = 'create' | 'profile' | 'archive';
type ContentTab = 'hooks' | 'script' | 'caption' | 'ctas' | 'hashtags';

interface ContentOutput {
  hooks?: string[];
  script?: string;
  caption?: string;
  ctas?: string[];
  hashtags?: string[];
  contentPlan?: string;
}

interface GenerationRow {
  id: string;
  input_text: string;
  tone: string | null;
  platform: string | null;
  ai_output: ContentOutput;
  created_at: string;
}

const CONTENT_TABS: { id: ContentTab; label: string; icon: ReactNode; shortLabel: string }[] = [
  { id: 'hooks',    label: 'Hooks',    shortLabel: 'Hooks',   icon: <Zap           className="h-3.5 w-3.5" strokeWidth={2} /> },
  { id: 'script',   label: 'Script',   shortLabel: 'Script',  icon: <FileText      className="h-3.5 w-3.5" strokeWidth={2} /> },
  { id: 'caption',  label: 'Caption',  shortLabel: 'Caption', icon: <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} /> },
  { id: 'ctas',     label: 'CTA',      shortLabel: 'CTA',     icon: <Target        className="h-3.5 w-3.5" strokeWidth={2} /> },
  { id: 'hashtags', label: 'Hashtags', shortLabel: 'Tags',    icon: <Hash          className="h-3.5 w-3.5" strokeWidth={2} /> },
];

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
  const [tone, setTone] = useState<HookTone>('Professional');
  const [pack, setPack] = useState<ContentPack | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>('hooks');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationRow[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const limit = monthlyGenerationLimit(tier);
  const usageLabel =
    limit === 'unlimited' ? 'Unlimited usage' : `${usedThisMonth} / ${limit} this month`;
  const settings = contentGenSettings(tier);

  const loadSubscription = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setEmail(user.email ?? null);
    setUserId(user.id);
    setUserCreatedAt(user.created_at ?? null);

    const { data: prof } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .maybeSingle();

    setTier(normalizeTier(prof?.subscription_status as string | undefined));

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
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) { router.replace('/login'); return; }
      setReady(true);
      await loadSubscription();
      await loadHistory();
    })();
    return () => { cancelled = true; };
  }, [router, supabase, loadHistory, loadSubscription]);

  function showToast(msg: string, ms = 2200) {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }

  function copyText(text: string, key: string) {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied!');
    setTimeout(() => setCopiedKey(null), 1800);
  }

  async function generate() {
    if (!topic.trim()) return;
    if (tier === 'starter' && !isToneUnlockedForTier(tier, tone)) {
      setError('This tone requires a Pro or Unlimited plan.');
      showToast('Upgrade to unlock this tone.', 4000);
      return;
    }
    setLoading(true);
    setError(null);
    setPack(null);
    setActiveTab('hooks');
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), tone }),
      });
      const data = (await res.json()) as ContentPack & { error?: string; code?: string };
      if (!res.ok) {
        setError(data.error ?? 'Request failed.');
        return;
      }
      setPack(data);
      showToast('Content pack ready!');
        await loadHistory();
        await loadSubscription();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-9 w-9 animate-spin text-[#FF0000]" strokeWidth={1.5} />
      </div>
    );
  }

  const sidebarNav: { key: NavKey; label: string; icon: ReactNode }[] = [
    { key: 'create',  label: 'Content Factory', icon: <Zap         className="h-5 w-5" strokeWidth={1.5} /> },
    { key: 'profile', label: 'Profile',         icon: <UserIcon    className="h-5 w-5" strokeWidth={1.5} /> },
    { key: 'archive', label: 'Archive',         icon: <HistoryIcon className="h-5 w-5" strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* ── MOBILE OVERLAY ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-[#121212] bg-[#121212] transition-transform duration-200 md:static md:w-64 md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-black p-4">
          <Link href="/dashboard" className="flex items-center py-1">
            <Logo className="h-8 w-auto text-white" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-[#A0A0A0] hover:text-white md:hidden"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {sidebarNav.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => { setNav(item.key); setSidebarOpen(false); }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest transition',
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

        <div className="border-t border-black p-4">
          <div className="rounded-2xl border border-[#121212] bg-black/60 p-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">Plan</p>
            <p className="mt-1 font-display text-lg font-black text-[#FF0000]">{planDisplayName(tier)}</p>
            <p className="mt-2 text-xs font-semibold text-white">{usageLabel}</p>
            {tier === 'starter' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                10 gen/mo · {settings.hookCount} hooks · {settings.hashtagCount} tags
              </p>
            )}
            {tier === 'pro' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                50 gen/mo · {settings.hookCount} hooks · {settings.hashtagCount} tags
              </p>
            )}
            {tier === 'unlimited' && (
              <p className="mt-1 text-[10px] text-[#A0A0A0]">
                Unlimited · {settings.hookCount} hooks · {settings.hashtagCount} tags
              </p>
            )}
          </div>
          {tier === 'starter' && (
            <Link
              href="/pricing"
              className="mt-4 flex flex-col gap-2 rounded-2xl border border-[#FF0000]/55 bg-[#FF0000]/10 p-4 transition hover:border-[#FF0000] hover:bg-[#FF0000]/15"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0000]">Upgrade plan</span>
              <span className="text-xs font-semibold leading-snug text-white">
                More hooks, hashtags &amp; all tones unlocked.
              </span>
              <span className="text-[11px] font-bold text-[#FF0000]">View pricing →</span>
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
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile top bar with hamburger */}
        <header className="flex items-center justify-between gap-3 border-b border-[#121212] bg-black px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-white transition hover:bg-[#121212]"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-xs font-bold uppercase tracking-widest text-[#FF0000]">
              {planDisplayName(tier)}
            </p>
            <p className="truncate text-[10px] text-[#A0A0A0]">{usageLabel}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-2 text-[#A0A0A0] transition hover:text-white"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <main className="flex min-h-0 flex-1 flex-col lg:flex-row">

          {/* ── CREATE / CONTENT FACTORY ──────────────────────── */}
          {nav === 'create' && (
            <>
              {/* Left panel — inputs */}
              <section className="flex w-full flex-col border-b border-[#121212] p-6 lg:w-[380px] lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto">
                <div className="mb-1 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#FF0000]" strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FF0000]">
                    Content Factory
                  </span>
                </div>
                <p className="mb-6 text-[11px] text-[#A0A0A0]">
                  One topic → 5 assets: Hook, Script, Caption, CTA & Hashtags.
                </p>

                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  What&apos;s your topic?
                </label>
                <Textarea
                  className="mt-3 min-h-[120px]"
                  placeholder="Be specific — product launch, tutorial, story, opinion..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />

                <p className="mt-7 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">
                  Tone
                </p>
                <p className="mt-1 text-[11px] text-[#A0A0A0]">
                  Shapes every asset — hook energy, script voice, caption style.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {ALL_TONES.map((t) => {
                    const locked = tier === 'starter' && !isToneUnlockedForTier(tier, t);
                    const selected = tone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={cn(
                          'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition',
                          selected
                            ? locked
                              ? 'border-[#FF0000] bg-black text-white ring-2 ring-[#FF0000]/35'
                              : 'border-[#FF0000] bg-black text-white neon-red-glow'
                            : locked
                              ? 'border-[#121212] bg-[#121212]/45 text-[#A0A0A0] hover:border-[#FF0000]/35'
                              : 'border-[#121212] bg-[#121212]/60 text-[#A0A0A0] hover:border-[#FF0000]/40'
                        )}
                      >
                        {locked && <Lock className="h-3.5 w-3.5 shrink-0 text-[#FF0000]" strokeWidth={1.5} />}
                          {t}
                      </button>
                    );
                  })}
                </div>

                {/* Tier output summary */}
                <div className="mt-6 rounded-xl border border-[#121212] bg-[#121212]/40 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A0A0A0]">
                    This generation produces:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-white">
                    <span className="text-[#FF0000]">{settings.hookCount} hooks</span>
                    <span>Script</span>
                    <span>Caption</span>
                    <span>{settings.ctaCount === 'unlimited' ? '∞' : settings.ctaCount} CTAs</span>
                    <span>{settings.hashtagCount} hashtags</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="mt-6 w-full py-4 text-sm font-black uppercase tracking-widest"
                  disabled={loading || !topic.trim()}
                  onClick={generate}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" strokeWidth={1.5} />
                      Generating all assets…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" strokeWidth={1.5} />
                      Generate Content Pack
                    </>
                  )}
                </Button>

                {error && (
                  <p className="mt-4 text-xs font-semibold text-[#fecaca]">{error}</p>
                )}
              </section>

              {/* Right panel — output tabs */}
              <section className="flex flex-1 flex-col overflow-hidden bg-black">
                {/* Tab bar */}
                <div className="flex items-center gap-1 overflow-x-auto border-b border-[#121212] px-4 py-3 scrollbar-none">
                  {CONTENT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition',
                        activeTab === tab.id
                          ? 'border-[#FF0000] bg-black text-[#FF0000]'
                          : 'border-[#121212] bg-[#121212]/50 text-[#A0A0A0] hover:text-white'
                      )}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-6">

                  {/* ── HOOKS ── */}
                  {activeTab === 'hooks' && (
                    <OutputSection
                      title="Hooks"
                      subtitle={`${settings.hookCount} scroll-stopping openers`}
                      copyAllLabel="Copy all hooks"
                      copyAllText={pack?.hooks.join('\n\n')}
                      onCopyAll={(t) => copyText(t, 'hooks-all')}
                      copiedKey={copiedKey}
                      loading={loading}
                      empty={!pack}
                      emptyIcon={<Zap className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />}
                      emptyText="Enter a topic and generate — hooks appear here."
                    >
                      {loading ? (
                        <SkeletonList count={settings.hookCount} height="h-20" />
                      ) : pack?.hooks.length ? (
                        <ul className="space-y-4">
                          {pack.hooks.map((h, i) => (
                            <CopyCard
                        key={i}
                              copyKey={`hook-${i}`}
                              copiedKey={copiedKey}
                              onCopy={() => copyText(h, `hook-${i}`)}
                              accent
                            >
                              <p className="text-base font-semibold leading-relaxed text-white">{h}</p>
                            </CopyCard>
                          ))}
                        </ul>
                      ) : null}
                    </OutputSection>
                  )}

                  {/* ── SCRIPT ── */}
                  {activeTab === 'script' && (
                    <OutputSection
                      title="Video Script"
                      subtitle="Scene-by-scene short-form script"
                      copyAllLabel="Copy script"
                      copyAllText={pack?.script}
                      onCopyAll={(t) => copyText(t, 'script-all')}
                      copiedKey={copiedKey}
                      loading={loading}
                      empty={!pack}
                      emptyIcon={<FileText className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />}
                      emptyText="Generate a content pack to see the script here."
                    >
                      {loading ? (
                        <SkeletonList count={4} height="h-10" />
                      ) : pack?.script ? (
                        <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                            {pack.script}
                    </p>
                  </div>
                      ) : null}
                    </OutputSection>
                  )}

                  {/* ── CAPTION ── */}
                  {activeTab === 'caption' && (
                    <OutputSection
                      title="Post Caption"
                      subtitle="Persuasive post copy with emojis"
                      copyAllLabel="Copy caption"
                      copyAllText={pack?.caption}
                      onCopyAll={(t) => copyText(t, 'caption-all')}
                      copiedKey={copiedKey}
                      loading={loading}
                      empty={!pack}
                      emptyIcon={<MessageSquare className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />}
                      emptyText="Generate a content pack to see the caption here."
                    >
                      {loading ? (
                        <SkeletonList count={3} height="h-10" />
                      ) : pack?.caption ? (
                        <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                            {pack.caption}
                          </p>
                        </div>
                      ) : null}
                    </OutputSection>
                  )}

                  {/* ── CTAs ── */}
                  {activeTab === 'ctas' && (
                    <OutputSection
                      title="Calls to Action"
                      subtitle={settings.ctaCount === 'unlimited' ? 'Unlimited high-conversion CTAs' : `${settings.ctaCount} high-conversion CTAs`}
                      copyAllLabel="Copy all CTAs"
                      copyAllText={pack?.ctas.join('\n')}
                      onCopyAll={(t) => copyText(t, 'ctas-all')}
                      copiedKey={copiedKey}
                      loading={loading}
                      empty={!pack}
                      emptyIcon={<Target className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />}
                      emptyText="Generate a content pack to see CTAs here."
                    >
                      {loading ? (
                        <SkeletonList count={resolveCTACount(settings.ctaCount)} height="h-14" />
                      ) : pack?.ctas.length ? (
                        <ul className="space-y-3">
                          {pack.ctas.map((c, i) => (
                            <CopyCard
                              key={i}
                              copyKey={`cta-${i}`}
                              copiedKey={copiedKey}
                              onCopy={() => copyText(c, `cta-${i}`)}
                            >
                              <p className="text-sm font-semibold text-white">{c}</p>
                            </CopyCard>
                          ))}
                        </ul>
                      ) : null}
                    </OutputSection>
                  )}

                  {/* ── HASHTAGS ── */}
                  {activeTab === 'hashtags' && (
                    <OutputSection
                      title="Hashtags"
                      subtitle={`${settings.hashtagCount} targeted tags`}
                      copyAllLabel="Copy all hashtags"
                      copyAllText={pack?.hashtags.join(' ')}
                      onCopyAll={(t) => copyText(t, 'hashtags-all')}
                      copiedKey={copiedKey}
                      loading={loading}
                      empty={!pack}
                      emptyIcon={<Hash className="mb-4 h-10 w-10 text-[#FF0000]" strokeWidth={1.5} />}
                      emptyText="Generate a content pack to see hashtags here."
                    >
                      {loading ? (
                        <div className="flex flex-wrap gap-3">
                          {Array.from({ length: settings.hashtagCount }).map((_, i) => (
                            <div key={i} className="h-8 w-28 animate-pulse rounded-full border border-[#121212] bg-[#121212]/60" />
                          ))}
                        </div>
                      ) : pack?.hashtags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {pack.hashtags.map((tag, i) => (
                          <button
                              key={i}
                            type="button"
                              onClick={() => copyText(tag, `tag-${i}`)}
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition',
                                copiedKey === `tag-${i}`
                                ? 'border-[#FF0000] bg-black text-[#FF0000]'
                                  : 'border-[#121212] bg-[#121212]/60 text-white hover:border-[#FF0000]/60 hover:text-[#FF0000]'
                              )}
                            >
                              {copiedKey === `tag-${i}`
                                ? <Check className="h-3 w-3" strokeWidth={2} />
                                : <Copy className="h-3 w-3" strokeWidth={2} />}
                              {tag}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </OutputSection>
                  )}


                </div>
              </section>
            </>
          )}

          {/* ── PROFILE ────────────────────────────────────────── */}
          {nav === 'profile' && (
            <section className="flex-1 space-y-8 overflow-y-auto p-6">
              <div>
                <h2 className="font-display text-2xl font-black text-white">Profile</h2>
                <p className="mt-1 text-sm text-[#A0A0A0]">Account details, plan summary and upgrade</p>
              </div>

              <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">Account info</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">Email</dt>
                    <dd className="mt-1 font-medium text-white">{email ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">User ID</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-[#A0A0A0]">{userId ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">Member since</dt>
                    <dd className="mt-1 text-white">
                      {userCreatedAt ? new Date(userCreatedAt).toLocaleString('en-US') : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-6">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#A0A0A0]">Plan details</p>
                <p className="mt-3 font-display text-2xl font-black text-[#FF0000]">{planDisplayName(tier)}</p>
                <p className="mt-2 text-sm text-white">{usageLabel}</p>
                <ul className="mt-4 space-y-2 text-xs text-[#A0A0A0]">
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">Monthly limit: {limit === 'unlimited' ? 'Unlimited' : `${limit} generations`}</li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">Hooks per generation: {settings.hookCount}</li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">CTAs per generation: {settings.ctaCount === 'unlimited' ? 'Unlimited' : settings.ctaCount}</li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">Hashtags: {settings.hashtagCount}</li>
                  <li className="border-l-2 border-[#FF0000]/50 pl-3">Tones: {tier === 'starter' ? 'Professional, Casual, Street Style; others require upgrade' : 'All tones'}</li>
                </ul>
              </div>

              {tier === 'starter' && (
                <div className="rounded-2xl border border-[#FF0000]/45 bg-[#FF0000]/10 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0000]">Upgrade your plan</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    More hooks, more hashtags, script & caption, all tones, and more monthly generations.
                  </p>
                  <Link href="/pricing" className="mt-4 inline-flex rounded-xl bg-[#FF0000] px-5 py-3 text-xs font-black uppercase tracking-widest text-white neon-red-glow hover:bg-[#CC0000]">
                    View pricing
                  </Link>
                </div>
              )}

              {tier !== 'starter' && (
                <CancelSubscriptionCard
                  onCancel={async () => {
                    const confirmed = window.confirm(
                      'Are you sure you want to cancel your subscription? You will keep access until the end of the billing period.'
                    );
                    if (!confirmed) return;
                    try {
                      const res = await fetch('/api/paddle/cancel', { method: 'POST' });
                      const json = await res.json() as { ok?: boolean; error?: string };
                      if (!res.ok) {
                        showToast(json.error ?? 'Could not cancel. Please contact support.');
                      } else {
                        showToast('Subscription cancelled. Access continues until end of period.');
                        await loadSubscription();
                      }
                    } catch {
                      showToast('Network error. Try again.');
                    }
                  }}
                />
              )}

              <Link href="/pricing" className="inline-flex rounded-xl border border-[#FF0000]/50 px-5 py-3 text-sm font-bold text-[#FF0000] hover:bg-[#FF0000]/10">
                Pricing page →
              </Link>
            </section>
          )}

          {/* ── ARCHIVE ────────────────────────────────────────── */}
          {nav === 'archive' && (
            <section className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <h2 className="font-display text-2xl font-black text-white">Archive</h2>
              <p className="mt-2 text-sm text-[#A0A0A0]">Your last 30 saved generations</p>
              <div className="mt-8 space-y-4">
                {history.length === 0 ? (
                  <p className="text-sm text-[#A0A0A0]">No records yet.</p>
                ) : (
                  history.map((row) => {
                    const isFullPack = !!(row.ai_output?.script || row.ai_output?.caption);
                    return (
                      <div key={row.id} className="rounded-2xl border border-[#121212] bg-[#121212]/40 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                          <div className="flex items-center gap-2">
                        <span className="text-[#FF0000]">{row.tone ?? '—'}</span>
                            {isFullPack && (
                              <span className="rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-2 py-0.5 text-[9px] font-black text-[#FF0000]">
                                Full pack
                              </span>
                            )}
                          </div>
                          <span>{new Date(row.created_at).toLocaleString('en-US')}</span>
                      </div>
                        <p className="mt-2 text-sm font-semibold text-white">{row.input_text}</p>

                        {/* Hooks */}
                        {(row.ai_output?.hooks ?? []).length > 0 && (
                      <ul className="mt-3 space-y-2">
                            {(row.ai_output.hooks ?? []).map((h, idx) => (
                              <li key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-black bg-black/40 p-3 text-xs text-[#A0A0A0]">
                            <span className="text-white/90">{h}</span>
                            <button
                              type="button"
                                  onClick={() => copyText(h, `arch-hook-${row.id}-${idx}`)}
                              className="shrink-0 text-[#FF0000] hover:text-white"
                            >
                                  {copiedKey === `arch-hook-${row.id}-${idx}`
                                    ? <Check className="h-4 w-4" strokeWidth={1.5} />
                                    : <Copy className="h-4 w-4" strokeWidth={1.5} />}
                            </button>
                          </li>
                        ))}
                      </ul>
                        )}

                        {/* Asset type badges */}
                        {isFullPack && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {row.ai_output.script    && <AssetBadge label="Script"   icon={<FileText      className="h-3 w-3" />} />}
                            {row.ai_output.caption   && <AssetBadge label="Caption"  icon={<MessageSquare className="h-3 w-3" />} />}
                            {(row.ai_output.ctas?.length ?? 0) > 0 && <AssetBadge label="CTAs"     icon={<Target        className="h-3 w-3" />} />}
                            {(row.ai_output.hashtags?.length ?? 0) > 0 && <AssetBadge label="Hashtags" icon={<Hash     className="h-3 w-3" />} />}
                          </div>
                        )}
                    </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 rounded-2xl border border-[#FF0000]/40 bg-black px-6 py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#FF0000] neon-red-glow">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function OutputSection({
  title,
  subtitle,
  copyAllLabel,
  copyAllText,
  onCopyAll,
  copiedKey,
  loading,
  empty,
  emptyIcon,
  emptyText,
  children,
}: {
  title: string;
  subtitle: string;
  copyAllLabel: string;
  copyAllText?: string;
  onCopyAll: (t: string) => void;
  copiedKey: string | null;
  loading: boolean;
  empty: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-black text-white">{title}</h2>
          <p className="mt-0.5 text-[11px] text-[#A0A0A0]">{subtitle}</p>
        </div>
        {!loading && copyAllText && (
          <button
            type="button"
            onClick={() => onCopyAll(copyAllText)}
            className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#FF0000] hover:text-white"
          >
            {copyAllLabel}
          </button>
        )}
      </div>

      {!loading && empty ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#121212] py-16 text-center">
          {emptyIcon}
          <p className="max-w-sm text-sm text-[#A0A0A0]">{emptyText}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function CopyCard({
  children,
  copyKey,
  copiedKey,
  onCopy,
  accent = false,
}: {
  children: ReactNode;
  copyKey: string;
  copiedKey: string | null;
  onCopy: () => void;
  accent?: boolean;
}) {
  const copied = copiedKey === copyKey;
  return (
    <li
      className={cn(
        'rounded-2xl border border-[#121212] bg-[#121212]/40 p-5',
        accent && 'pl-4'
      )}
      style={accent ? { borderLeftWidth: 4, borderLeftColor: '#FF0000' } : undefined}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">{children}</div>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition',
            copied
              ? 'border-[#FF0000] bg-black text-[#FF0000]'
              : 'border-[#121212] bg-black text-white hover:border-[#FF0000]'
          )}
        >
          {copied ? (
            <><Check className="h-4 w-4" strokeWidth={1.5} /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4" strokeWidth={1.5} /> Copy</>
          )}
        </button>
      </div>
    </li>
  );
}

function SkeletonList({ count, height }: { count: number; height: string }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('animate-pulse rounded-2xl border border-[#121212] bg-[#121212]/60', height)} />
      ))}
    </div>
  );
}

function AssetBadge({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#121212] bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#A0A0A0]">
      {icon}
      {label}
    </span>
  );
}

function CancelSubscriptionCard({ onCancel }: { onCancel: () => Promise<void> }) {
  const [cancelling, setCancelling] = useState(false);

  return (
    <div className="rounded-2xl border border-[#B91C1C]/40 bg-[#B91C1C]/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]" strokeWidth={1.5} />
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B91C1C]">
            Cancel Subscription
          </p>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            You will keep full access until the end of your current billing period. After that,
            your account reverts to the free plan.
          </p>
          <button
            type="button"
            disabled={cancelling}
            onClick={async () => {
              setCancelling(true);
              await onCancel();
              setCancelling(false);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#B91C1C]/50 bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#B91C1C] transition hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 disabled:opacity-50"
          >
            {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {cancelling ? 'Cancelling…' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}
