import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BeforeAfterCard({ className }: { className?: string }) {
  return (
    <div className={cn('relative mx-auto w-full max-w-lg', className)}>
      <div className="pointer-events-none absolute -inset-4 rounded-[28px] bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.12),_transparent_65%)] blur-xl" />
      <div className="relative overflow-hidden rounded-3xl border border-[#121212] bg-[#121212] shadow-[0_24px_80px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:-translate-y-1">
        <div className="flex items-center justify-between border-b border-black px-5 py-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">
            Örnek akış
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FF0000]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Hookerra
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
          <div className="border-b border-black p-5 md:border-b-0 md:border-r">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A0A0A0]">
              Önce
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0] line-through decoration-[#A0A0A0]/40">
              Bugün size ürünümüzün özelliklerinden bahsetmek istiyorum. Oldukça kullanışlı
              ve...
            </p>
          </div>

          <div className="flex items-center justify-center bg-black py-2 md:flex-col md:py-0 md:px-2">
            <ArrowRight className="h-5 w-5 rotate-90 text-[#FF0000] md:rotate-0" strokeWidth={2} />
          </div>

          <div className="relative p-5">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,0,0,0.06)_0%,_transparent_45%)]" />
            <p className="relative text-[10px] font-black uppercase tracking-[0.25em] text-[#FF0000] neon-red-text">
              Sonra
            </p>
            <p className="relative mt-3 border-l-4 border-[#FF0000] pl-4 text-base font-extrabold leading-snug tracking-tight text-white">
              3 saniye içinde ya durdurursun ya da kaybedersin — işte bu yüzden{' '}
              <span className="text-[#FF0000]">ilk cümle cinayettir.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
