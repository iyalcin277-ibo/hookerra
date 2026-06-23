'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrong = password.length >= 8;
  const passwordsMatch = password === confirm && confirm.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordStrong) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) throw updateErr;
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
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
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF0000]/40 bg-black shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            <Lock className="h-7 w-7 text-[#FF0000]" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-black text-white">Set new password</h1>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Choose a strong password to secure your account.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#B91C1C]/40 bg-[#B91C1C]/10 px-4 py-3 text-xs font-semibold text-[#fecaca]">
            {error}
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-[#FF0000]" strokeWidth={1.5} />
            <p className="text-sm font-bold text-white">Password updated successfully!</p>
            <p className="text-xs text-[#A0A0A0]">Redirecting to dashboard…</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length === 0
                      ? 'bg-[#121212]'
                      : password.length < 8
                        ? 'bg-yellow-600'
                        : 'bg-[#FF0000]'
                  }`}
                />
                <span className="text-[10px] font-semibold text-[#A0A0A0]">
                  {password.length === 0 ? '' : password.length < 8 ? 'Too short' : 'Strong'}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0]">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {confirm.length > 0 && (
                <p
                  className={`mt-1 text-[10px] font-semibold ${
                    passwordsMatch ? 'text-[#FF0000]' : 'text-yellow-500'
                  }`}
                >
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !passwordStrong || !passwordsMatch}
              className="w-full py-4"
            >
              {loading ? '…' : 'Update password'}
            </Button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-8 block text-center text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-white"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
