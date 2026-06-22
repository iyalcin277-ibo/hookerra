import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function PublicFooter({ logoHref = '/' }: { logoHref?: string }) {
  return (
    <footer className="border-t border-[#121212] bg-black px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href={logoHref} className="transition-opacity hover:opacity-90">
            <Logo className="h-8 w-auto text-white" />
          </Link>
          <p className="text-xs font-medium text-[#A0A0A0]">© 2026 Hookerra</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            ['Pricing', '/pricing'],
            ['About', '/about'],
            ['Terms', '/terms'],
            ['Privacy', '/privacy'],
            ['Refund', '/refund'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
