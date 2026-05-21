export type TierId = 'starter' | 'pro' | 'unlimited';

/** Ücretsiz pakette seçilebilen tonlar */
export const FREE_TONES = ['Profesyonel', 'Samimi', 'Sokak Stili'] as const;
export type FreeTone = (typeof FREE_TONES)[number];

/** Tüm tonlar (premium’da hepsi açık) */
export const ALL_TONES = [
  ...FREE_TONES,
  'Agresif',
  'Şok Edici',
  'Komik',
] as const;
export type HookTone = (typeof ALL_TONES)[number];

export function normalizeTier(raw: string | null | undefined): TierId {
  const s = (raw ?? 'starter').toLowerCase();
  if (s === 'pro') return 'pro';
  if (s === 'unlimited' || s === 'elite' || s === 'enterprise') return 'unlimited';
  return 'starter';
}

export function monthlyGenerationLimit(tier: TierId): number | 'unlimited' {
  switch (tier) {
    case 'starter':
      return 10;
    case 'pro':
      return 50;
    default:
      return 'unlimited';
  }
}

/** Ücretsiz: 3 hook; Pro ve Sınırsız: 5 hook */
export function hooksPerResponse(tier: TierId): number {
  return tier === 'starter' ? 3 : 5;
}

export function planDisplayName(tier: TierId): string {
  switch (tier) {
    case 'starter':
      return 'Ücretsiz';
    case 'pro':
      return 'Pro';
    default:
      return 'Sınırsız';
  }
}

export function isToneUnlockedForTier(tier: TierId, tone: string): boolean {
  if (tier !== 'starter') return true;
  return FREE_TONES.includes(tone as FreeTone);
}

export function isFreeTone(tone: string): tone is FreeTone {
  return FREE_TONES.includes(tone as FreeTone);
}

/** Fiyatlandırma sayfası ($ USD) */
export const PRICING_USD = {
  proMonthly: 14.2,
  unlimitedMonthly: 28.5,
  yearlyDiscountPercent: 30,
} as const;

export function yearlyMonthlyEquivalent(monthly: number): number {
  return Math.round(monthly * (1 - PRICING_USD.yearlyDiscountPercent / 100) * 100) / 100;
}

export function yearlyTotalUsd(monthly: number): number {
  return Math.round(monthly * 12 * (1 - PRICING_USD.yearlyDiscountPercent / 100) * 100) / 100;
}

export function startOfUtcMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
}
