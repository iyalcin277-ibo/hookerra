import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import {
  getSupabasePublicConfig,
  isSupabasePublicConfigConfigured,
} from '@/lib/supabase/public-env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabasePublicConfig();

  return createServerClient(url, key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* Server Component — cookie refresh handled on Route Handler */
          }
        },
      },
    }
  );
}

/** Oturum okunamazsa veya ağ/DNS hatası varsa null döner (sayfa yine render olur). */
export async function getServerAuthUser(): Promise<User | null> {
  if (!isSupabasePublicConfigConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user ?? null;
  } catch {
    return null;
  }
}
