'use client';

import { cn } from '@/lib/utils';

export function TerminalMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[#121212] bg-[#121212] p-4 shadow-[0_0_40px_rgba(255,0,0,0.12)] sm:p-6',
        className
      )}
    >
      <div className="terminal-scanline absolute inset-0 rounded-2xl" />
      <div className="relative space-y-3 font-mono text-[11px] leading-relaxed text-[#A0A0A0] sm:text-xs">
        <div className="flex items-center gap-2 border-b border-black pb-2 text-[10px] uppercase tracking-widest text-[#FF0000]">
          <span className="h-2 w-2 rounded-full bg-[#FF0000] animate-terminal-line" />
          gemini • hook-engine
        </div>
        <p>
          <span className="text-white">$</span> input:{' '}
          <span className="text-white/90">
            &quot;Fitness içeriği — merak uyandırıcı ton&quot;
          </span>
        </p>
        <p className="animate-terminal-line text-[#FF0000]/90">
          ▸ model: gemini-2.5-flash … structured JSON
        </p>
        <pre className="overflow-x-auto rounded-xl border border-black bg-black p-3 text-[10px] text-white/90 sm:text-[11px]">
          {`{\n  "hooks": [\n    "3 saniyede kas yapılmaz — ama şu hata…",\n    "Spor salonuna gidiyorsun, sonuç sıfır: sebebi bu."\n  ]\n}`}
        </pre>
        <p>
          <span className="text-white">$</span> status:{' '}
          <span className="text-[#FF0000]">ready</span>
          <span className="animate-terminal-cursor ml-1 inline-block h-3 w-1.5 bg-[#FF0000]" />
        </p>
      </div>
    </div>
  );
}
