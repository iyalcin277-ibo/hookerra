import { initializePaddle, type Paddle } from '@paddle/paddle-js';

/** Paddle price IDs — set in .env.local */
export const PADDLE_PRICE_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID ?? '',
  pro_yearly: process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID ?? '',
  unlimited_monthly: process.env.NEXT_PUBLIC_PADDLE_UNLIMITED_MONTHLY_PRICE_ID ?? '',
  unlimited_yearly: process.env.NEXT_PUBLIC_PADDLE_UNLIMITED_YEARLY_PRICE_ID ?? '',
} as const;

export type PaddlePlanKey = keyof typeof PADDLE_PRICE_IDS;

/** Returns 'pro' | 'unlimited' | null from a Paddle price ID */
export function tierFromPriceId(priceId: string): 'pro' | 'unlimited' | null {
  if (
    priceId === PADDLE_PRICE_IDS.pro_monthly ||
    priceId === PADDLE_PRICE_IDS.pro_yearly
  ) {
    return 'pro';
  }
  if (
    priceId === PADDLE_PRICE_IDS.unlimited_monthly ||
    priceId === PADDLE_PRICE_IDS.unlimited_yearly
  ) {
    return 'unlimited';
  }
  return null;
}

let _paddle: Paddle | null = null;

/** Lazily initializes and returns the Paddle instance (client-side only). */
export async function getPaddle(): Promise<Paddle | null> {
  if (typeof window === 'undefined') return null;
  if (_paddle) return _paddle;

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    console.warn('[paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set.');
    return null;
  }

  const env =
    (process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production' | undefined) ??
    'sandbox';

  _paddle =
    (await initializePaddle({
      environment: env,
      token,
    })) ?? null;

  return _paddle;
}
