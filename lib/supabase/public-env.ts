/**
 * Lets `next build` prerender routes that import Supabase without crashing when
 * `.env.local` is missing. Replace with real keys for runtime auth/API.
 */
function normalizeEnv(v: string | undefined): string {
  if (v == null) return '';
  return v.replace(/^\uFEFF/, '').trim();
}

function pickSupabaseUrl(): string {
  return normalizeEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL
  );
}

/** Supabase Dashboard'daki hem JWT anon (`eyJ…`) hem `sb_publishable_…` anahtarları desteklenir. */
function pickSupabaseAnon(): string {
  return normalizeEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_KEY
  );
}

/** Yerel geliştirmede Supabase çağrılarını kapatır (ör. yanlış URL / ENOTFOUND). İstemci için de `NEXT_PUBLIC_` kullanın. */
function isSupabaseExplicitlyDisabled(): boolean {
  const flags = [
    normalizeEnv(process.env.HOOKERRA_DISABLE_SUPABASE),
    normalizeEnv(process.env.NEXT_PUBLIC_HOOKERRA_DISABLE_SUPABASE),
  ];
  return flags.some(
    (v) =>
      v === '1' ||
      v.toLowerCase() === 'true' ||
      v.toLowerCase() === 'yes'
  );
}

/** Gerçek ortam değişkenleri verilmişse ve devre dışı bırakılmamışsa true; yoksa yerel geliştirmede placeholder kullanılır. */
export function isSupabasePublicConfigConfigured(): boolean {
  if (isSupabaseExplicitlyDisabled()) return false;
  return Boolean(pickSupabaseUrl() && pickSupabaseAnon());
}

export function getSupabasePublicConfig(): { url: string; key: string } {
  const url = pickSupabaseUrl();
  const key = pickSupabaseAnon();
  if (url && key) return { url, key };

  if (process.env.NODE_ENV === 'development') {
    const keys = Object.keys(process.env)
      .filter((k) => k.includes('SUPABASE'))
      .sort();
    console.warn(
      '[hookerra] NEXT_PUBLIC_SUPABASE_URL veya anon/publishable anahtarı eksik — placeholder kullanılıyor.'
    );
    console.warn(
      '[hookerra] Kontrol: kökte `.env.local`, UTF-8 (BOM’suz), tam satırlar:',
      'NEXT_PUBLIC_SUPABASE_URL=…',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=…'
    );
    console.warn('[hookerra] process.env içinde SUPABASE geçen anahtarlar:', keys.length ? keys : '(hiçbiri yok)');
  }

  return {
    url: 'https://placeholder.supabase.co',
    key: 'sb_publishable_placeholder_hookerra_build_only',
  };
}
