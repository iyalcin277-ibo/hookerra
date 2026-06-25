'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function TopLoadingBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }

  useEffect(() => {
    clearTimers();

    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(25), 10);
    const t2 = setTimeout(() => setWidth(55), 150);
    const t3 = setTimeout(() => setWidth(80), 400);
    const t4 = setTimeout(() => setWidth(100), 700);
    const t5 = setTimeout(() => setVisible(false), 950);

    timerRefs.current = [t1, t2, t3, t4, t5];

    return clearTimers;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] h-[3px] shadow-[0_0_12px_rgba(255,0,0,0.9)]"
      style={{
        width: `${width}%`,
        backgroundColor: '#FF0000',
        transition: width === 0 ? 'none' : 'width 0.3s ease-out',
      }}
    />
  );
}
