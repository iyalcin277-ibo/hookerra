import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-[#121212] bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#A0A0A0]/60 focus:border-[#FF0000]',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full resize-none rounded-2xl border border-[#121212] bg-[#121212] px-5 py-4 text-base font-medium text-white outline-none transition placeholder:text-[#A0A0A0]/50 focus:border-[#FF0000]',
        className
      )}
      {...props}
    />
  );
}
