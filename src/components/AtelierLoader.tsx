import { useEffect, useState } from 'react';

/** Luxury atelier entrance curtain: rose-gold monogram, hairline progress & silk exit. */
export function AtelierLoader() {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading');

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('done');
      return;
    }

    const exitTimer = window.setTimeout(() => setPhase('exiting'), 1050);
    const doneTimer = window.setTimeout(() => setPhase('done'), 1680);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] bg-[#FAF1F0] flex flex-col items-center justify-center px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        phase === 'exiting'
          ? 'opacity-0 -translate-y-6 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <span className="absolute inset-0 rounded-full border border-[#BC8379]/35 ao-spin-slow" />
        <span className="absolute inset-2 rounded-full border border-dashed border-[#9A6058]/30" />
        <img
          src="/shreya-logo-seal.png"
          alt="Shreya & Co."
          className="w-12 h-12 object-contain"
        />
      </div>

      <span className="font-serif text-2xl sm:text-3xl tracking-[0.3em] uppercase text-[#2B1C1E] font-normal">
        SHREYA &amp; CO.
      </span>
      <span className="text-[9px] uppercase tracking-[0.38em] text-[#9A6058] mt-2 mb-7">
        Prayagraj · Fine Jewellery &amp; Atelier
      </span>

      <div className="w-44 h-[1.5px] bg-[#2B1C1E]/10 overflow-hidden">
        <div className="h-full bg-[#BC8379] ao-loader-bar" />
      </div>
    </div>
  );
}

