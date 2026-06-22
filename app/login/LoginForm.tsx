'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginFormInner() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function onForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (resetErr) throw resetErr;
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send email.');
    } finally {
      setLoading(false);
    }
  }

  if (isForgotPassword) {
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
            <h1 className="font-display text-2xl font-black text-white">Forgot password</h1>
            <p className="mt-2 text-sm text-[#A0A0A0]">
              We&apos;ll send a password reset link to your email.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-[#B91C1C]/40 bg-[#B91C1C]/10 px-4 py-3 text-xs font-semibold text-[#fecaca]">
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="rounded-xl border border-green-700/40 bg-green-900/20 px-4 py-4 text-center text-sm font-semibold text-green-400">
              Password reset link sent. Check your inbox.
            </div>
          ) : (
            <form onSubmit={onForgotPassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                  Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full py-4">
                {loading ? '…' : 'Send reset link'}
              </Button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setResetSent(false);
              setError(null);
            }}
            className="mt-6 w-full text-center text-xs font-semibold text-[#A0A0A0] hover:text-white"
          >
            ← Back to sign in
          </button>

          <Link
            href="/"
            className="mt-8 block text-center text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-white"
          >
            Home
          </Link>
        </div>
      </div>
    );
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
            {isRegister ? 'Create account' : 'Sign in'}
          </h1>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Continue with your email — keys stay on the server.
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
              Email
            </label>
            <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
              Password
            </label>
            <Input
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isRegister && (
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotPassword(true);
                  setError(null);
                }}
                className="mt-2 text-[10px] font-semibold text-[#A0A0A0] hover:text-[#FF0000]"
              >
                Forgot password?
              </button>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full py-4">
            {loading ? '…' : isRegister ? 'Sign up' : 'Sign in'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 w-full text-center text-xs font-semibold text-[#A0A0A0] hover:text-white"
        >
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>

        <Link
          href="/"
          className="mt-8 block text-center text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-white"
        >
          Home
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
          Loading…
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
