import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight GPU-friendly vertical scroll parallax hook clamped per element.
 * Returns a ref to attach and the vertical offset in pixels (0 under reduced motion).
 */
export function useScrollParallax<T extends HTMLElement = HTMLDivElement>(maxShiftPx = 24) {
  const ref = useRef<T | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mqReduced.matches) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Normalized distance from viewport center in [-1, 1]
      const centerDelta = (rect.top + rect.height / 2 - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, centerDelta));
      setOffsetY(Number((clamped * maxShiftPx).toFixed(2)));
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [maxShiftPx]);

  return { ref, offsetY };
}

