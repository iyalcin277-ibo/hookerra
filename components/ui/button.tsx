import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' &&
          'bg-[#FF0000] text-white hover:bg-[#CC0000] neon-red-glow shadow-[0_0_15px_rgba(255,0,0,0.3)]',
        variant === 'ghost' && 'bg-transparent text-white hover:bg-[#121212]',
        variant === 'outline' &&
          'border border-[#121212] bg-black text-white hover:border-[#FF0000]',
        className
      )}
      {...props}
    />
  );
}
