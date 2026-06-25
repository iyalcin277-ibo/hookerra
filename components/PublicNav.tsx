'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/#how-it-works', label: 'How It Works' },
];

export function PublicNav({ className }: { className?: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load auth state once + listen for changes
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'fixed left-0 right-0 top-0 z-50 border-b border-[#121212] bg-black/60 backdrop-blur-xl backdrop-saturate-150',
          className
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
          {/* ── Logo — dynamic routing ── */}
          <Link
            href={email ? '/dashboard' : '/'}
            className="flex shrink-0 items-center gap-2"
          >
            <Logo className="h-8 w-auto sm:h-9" />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0] transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTA buttons ── */}
          <div className="hidden shrink-0 items-center gap-2 sm:gap-3 md:flex">
            {email ? (
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#121212]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#121212]"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#FF0000] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(255,0,0,0.3)] transition hover:bg-[#CC0000]"
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((v) => !v)}
            className="flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-[#121212] md:hidden"
          >
            {isOpen ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        <div
          className={cn(
            'overflow-hidden border-t border-[#121212] bg-black/95 backdrop-blur-xl transition-all duration-200 md:hidden',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#A0A0A0] transition hover:bg-[#121212] hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-[#121212]" />

            {email ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#121212]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#121212]"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-xl bg-[#FF0000] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_0_15px_rgba(255,0,0,0.3)] transition hover:bg-[#CC0000]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Tap-outside overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
