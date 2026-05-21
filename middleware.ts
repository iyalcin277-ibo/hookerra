import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  getSupabasePublicConfig,
  isSupabasePublicConfigConfigured,
} from '@/lib/supabase/public-env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  if (!isSupabasePublicConfigConfigured()) {
    return NextResponse.next();
  }

  const { url: supabaseUrl, key: supabaseKey } = getSupabasePublicConfig();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    /* Örn. ENOTFOUND / kapalı proje: istek devam eder, konsolu kirleten retry’lar yine kütüphaneden gelebilir */
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/:path*'],
};
