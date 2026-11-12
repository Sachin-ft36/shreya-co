import { ChevronRight } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useScrollParallax } from '../hooks/useScrollParallax';
import { useSpringTilt } from '../hooks/useSpringTilt';
import { AtelierDossierTab } from '../types/storefront';

interface HeritageSectionProps {
  onOpenProvenance: (tab: AtelierDossierTab) => void;
}

/** Centered editorial manifesto with interactive 3D metallic monogram foil seal & scroll parallax. */
export function HeritageSection({ onOpenProvenance }: HeritageSectionProps) {
  const { tilt, bind } = useSpringTilt({
    maxDeg: 8.5,
    damping: 0.08,
    ambientDrift: true
  });
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.14);
  const { ref: sealParallaxRef, offsetY: sealOffsetY } = useScrollParallax<HTMLDivElement>(22);

  return (
    <section
      id="heritage"
      ref={ref}
      data-visible={visible}
      aria-labelledby="heritage-heading"
      className="py-28 md:py-40 px-6 md:px-12 max-w-5xl mx-auto text-center ao-reveal"
    >
      {/* Interactive 3D Stamped Gold Foil Medallion with gentle vertical scroll parallax */}
      <div
        ref={sealParallaxRef}
        {...bind}
        style={{
          perspective: '860px',
          transform: `translate3d(0, ${sealOffsetY}px, 0)`
        }}
        className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-8 flex items-center justify-center cursor-default will-change-transform"
      >
        <div
          className="relative w-full h-full flex items-center justify-center ao-preserve-3d will-change-transform"
          style={{
            transform: `rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`
          }}
        >
          <img
            src="/shreya-logo-seal.png"
            alt="Shreya & Co. Monogram"
            loading="lazy"
            className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-[0_14px_24px_rgba(43,28,30,0.16)]"
            style={{ transform: 'translateZ(18px)' }}
          />
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-soft-light"
            style={{
              background: `radial-gradient(90px circle at ${tilt.lightX.toFixed(1)}% ${tilt.lightY.toFixed(1)}%, rgba(255, 250, 240, 0.72), transparent 65%)`
            }}
          />
        </div>
      </div>

      <h2
        id="heritage-heading"
        className="text-[10px] uppercase tracking-[0.4em] text-[#9A6058] block mb-8"
      >
        The Shreya &amp; Co. Philosophy
      </h2>
      <blockquote className="font-serif text-3xl md:text-4xl lg:text-[46px] font-light leading-[1.24] text-[#2B1C1E] mb-10">
        “True luxury is never loud. It is found in the quiet confidence of weight, the purity of origin, and a silhouette that defies transient eras.”
      </blockquote>
      <div className="w-12 h-[1px] bg-[#BC8379] mx-auto mb-6" />
      <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2B1C1E]/75 block mb-8">
        Shreya — Founder &amp; Creative Director · Prayagraj
      </span>

      <button
        type="button"
        onClick={() => onOpenProvenance('provenance')}
        className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.26em] text-[#2B1C1E]/70 hover:text-[#9A6058] border-b border-[#2B1C1E]/25 hover:border-[#BC8379] pb-1 transition-colors"
      >
        <span>Examine Material Provenance &amp; BIS Assay Ledger</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </section>
  );
}
