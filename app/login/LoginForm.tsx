'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('error');
    if (q === 'oauth') {
      const hint = searchParams.get('msg');
      setError(
        hint && process.env.NODE_ENV === 'development'
          ? `Google OAuth: ${hint}`
          : 'Google ile giriş tamamlanamadı. Tarayıcıda çerezlerin açık olduğundan emin olun; localhost ile girdiğiniz adresin (.env’deki SITE URL) aynı olduğunu kontrol edin.'
      );
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const { error: signErr } = await supabase.auth.signUp({ email, password });
        if (signErr) throw signErr;
      } else {
        const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signErr) throw signErr;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setError(null);
    setLoading(true);
    try {
      const base = window.location.origin;
      const { data, error: oAuthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${base}/auth/callback`,
        },
      });
      if (!oAuthErr && data?.url) {
        window.location.assign(data.url);
        return;
      }
      if (oAuthErr) {
        setError(oAuthErr.message);
      } else {
        setError('Google giriş adresi alınamadı. Sayfayı yenileyip tekrar deneyin.');
      }
      setLoading(false);
    } catch {
      setError('Google ile bağlantı kurulamadı.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-16">
      <Link href="/" className="mb-10">
        <Logo className="h-10 w-auto text-white" />
      </Link>

      <div className="w-full max-w-sm rounded-3xl border border-[#121212] bg-[#121212]/50 p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF0000]/40 bg-black neon-red-glow">
            <Lock className="h-7 w-7 text-[#FF0000]" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-black text-white">
            {isRegister ? 'Hesap oluştur' : 'Giriş yap'}
          </h1>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Google veya e-posta ile devam edin — anahtarlar sunucuda kalır.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#B91C1C]/40 bg-[#B91C1C]/10 px-4 py-3 text-xs font-semibold text-[#fecaca]">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
              E-posta
            </label>
            <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
              Şifre
            </label>
            <Input
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full py-4">
            {loading ? '…' : isRegister ? 'Kayıt ol' : 'Giriş yap'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#121212]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-[#121212]/50 px-2 text-[#A0A0A0]">veya</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 py-4"
          disabled={loading}
          onClick={google}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ile devam et
        </Button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 w-full text-center text-xs font-semibold text-[#A0A0A0] hover:text-white"
        >
          {isRegister ? 'Zaten hesabın var mı? Giriş' : 'Hesabın yok mu? Kayıt ol'}
        </button>

        <Link
          href="/"
          className="mt-8 block text-center text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-white"
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-sm text-[#A0A0A0]">
          Yükleniyor…
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
