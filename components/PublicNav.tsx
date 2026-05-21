import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export function PublicNav({
  email,
  className,
}: {
  email?: string | null;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-[#121212] bg-black/55 backdrop-blur-xl backdrop-saturate-150',
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
        <Link
          href={email ? '/dashboard' : '/'}
          className="flex shrink-0 items-center gap-2"
        >
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            href="/pricing"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0] transition hover:text-white"
          >
            Fiyatlandırma
          </Link>
          <Link
            href="/#nasil-calisir"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A0A0A0] transition hover:text-white"
          >
            Nasıl Çalışır
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {email ? (
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#121212]"
            >
              Panel
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#121212]"
            >
              Giriş Yap
            </Link>
          )}
          <Link
            href="/dashboard"
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-semibold text-white transition',
              'bg-[#FF0000] hover:bg-[#CC0000] neon-red-glow'
            )}
          >
            Hemen Başla
          </Link>
        </div>
      </div>
    </nav>
  );
}
