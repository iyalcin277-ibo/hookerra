import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicConfig } from '@/lib/supabase/public-env';

type CookieToSet = { name: string; value: string; options: CookieOptions };

function mergeRequestCookies(request: NextRequest, cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const byName = new Map<string, { name: string; value: string }>();
  for (const c of cookieStore.getAll()) {
    byName.set(c.name, { name: c.name, value: c.value });
  }
  for (const c of request.cookies.getAll()) {
    byName.set(c.name, { name: c.name, value: c.value });
  }
  return [...byName.values()];
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const oauthErr = searchParams.get('error');
  if (oauthErr) {
    return NextResponse.redirect(new URL('/login?error=oauth', origin));
  }

  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth', origin));
  }

  const { url: supabaseUrl, key: supabaseKey } = getSupabasePublicConfig();
  const response = NextResponse.redirect(new URL('/dashboard', origin));

  const cookieStore = await cookies();
  const allCookies = mergeRequestCookies(request, cookieStore);

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return allCookies;
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[hookerra auth/callback]', error.name, error.message);
    }
    const qs = new URLSearchParams({ error: 'oauth' });
    if (process.env.NODE_ENV === 'development' && error.message) {
      qs.set('msg', error.message.slice(0, 240));
    }
    return NextResponse.redirect(new URL(`/login?${qs}`, origin));
  }

  return response;
}
