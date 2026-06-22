import type { ReactNode } from 'react';
import Link from 'next/link';
import { PublicFooter } from '@/components/PublicFooter';
import { PublicNav } from '@/components/PublicNav';

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <PublicNav />
      <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 pb-20 pt-28">
        <Link href="/" className="mb-8 text-[10px] font-bold uppercase tracking-widest text-[#FF0000] hover:text-white">
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-black text-white">{title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#A0A0A0]">{children}</div>
      </main>
      <PublicFooter />
    </div>
  );
}
