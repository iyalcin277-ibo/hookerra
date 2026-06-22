export type TierId = 'starter' | 'pro' | 'unlimited';

/** Tones available on the free tier */
export const FREE_TONES = ['Professional', 'Casual', 'Street Style'] as const;
export type FreeTone = (typeof FREE_TONES)[number];

/** All tones (all unlocked on premium) */
export const ALL_TONES = [
  ...FREE_TONES,
  'Aggressive',
  'Shocking',
  'Funny',
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

/** Legacy: hooks per response for old route */
export function hooksPerResponse(tier: TierId): number {
  return tier === 'starter' ? 3 : 5;
}

/** Legacy: hashtags for old separate route */
export function hashtagsPerResponse(tier: TierId): number | null {
  if (tier === 'pro') return 15;
  if (tier === 'unlimited') return 30;
  return null;
}

/** Full content factory output settings per tier */
export interface ContentGenSettings {
  hookCount: number;
  ctaCount: number | 'unlimited';
  hashtagCount: number;
  scriptDepth: 'basic' | 'standard' | 'full';
}

export function contentGenSettings(tier: TierId): ContentGenSettings {
  switch (tier) {
    case 'starter':
      return { hookCount: 2, ctaCount: 1, hashtagCount: 5, scriptDepth: 'basic' };
    case 'pro':
      return { hookCount: 3, ctaCount: 50, hashtagCount: 15, scriptDepth: 'standard' };
    default:
      return { hookCount: 5, ctaCount: 'unlimited', hashtagCount: 30, scriptDepth: 'full' };
  }
}

/** Resolves ctaCount to a concrete number for use in AI prompts. */
export function resolveCTACount(ctaCount: number | 'unlimited'): number {
  return ctaCount === 'unlimited' ? 20 : ctaCount;
}

export function planDisplayName(tier: TierId): string {
  switch (tier) {
    case 'starter':
      return 'Free';
    case 'pro':
      return 'Pro';
    default:
      return 'Unlimited';
  }
}

export function isToneUnlockedForTier(tier: TierId, tone: string): boolean {
  if (tier !== 'starter') return true;
  return FREE_TONES.includes(tone as FreeTone);
}

export function isFreeTone(tone: string): tone is FreeTone {
  return FREE_TONES.includes(tone as FreeTone);
}

/** Pricing (USD) */
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

/** Shared content pack type — used by both the API route and the dashboard client */
export interface ContentPack {
  hooks: string[];
  script: string;
  caption: string;
  ctas: string[];
  hashtags: string[];
}

export function startOfUtcMonthIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)).toISOString();
}
