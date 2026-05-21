import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      className={cn(className, 'overflow-visible text-white')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform="translate(2, 0)">
        <circle cx="28" cy="30" r="28" fill="#121212" />
        <circle cx="34" cy="18" r="4" stroke="white" strokeWidth="3" fill="none" />
        <path
          d="M34 22 L34 42 C34 48 22 48 22 42 L22 32"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M22 36 L25 39" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <text
          x="65"
          y="38"
          fontFamily="Archivo Black, sans-serif"
          fontWeight="900"
          fontSize="28"
          fill="currentColor"
          letterSpacing="-1"
        >
          HOOKERRA
        </text>
        <text
          x="65"
          y="56"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          fontSize="14"
          fill="#FF0000"
          letterSpacing="6"
        >
          HOOK
        </text>
      </g>
    </svg>
  );
}
