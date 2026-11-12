import { useState } from 'react';
import { ArrowUpRight, Instagram, Move3d } from 'lucide-react';
import { HERO_SLIDES, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/catalog';
import { useScrollParallax } from '../hooks/useScrollParallax';
import { useSpringTilt } from '../hooks/useSpringTilt';
import { CurrencyCode, MetalFinish, Product } from '../types/storefront';
import { formatPrice, handleImgError } from '../utils/pricing';
import { HallmarkGlyph } from './HallmarkGlyph';
import { Jewelry3DCanvas } from './Jewelry3DCanvas';

interface HeroSectionProps {
  heroSlideIdx: number;
  currentHeroProduct: Product;
  currency: CurrencyCode;
  onSelectSlide: (idx: number) => void;
  onPauseChange: (paused: boolean) => void;
  onOpenQuickView: (product: Product, preferredMetal?: MetalFinish) => void;
  onAddToCart: (product: Product) => void;
}

/**
 * Asymmetric hero lookbook staged inside a damped 3-plane 3D museum vitrine
 * with studio softbox sheen and elevated floating dossier plaque.
 */
export function HeroSection({
  heroSlideIdx,
  currentHeroProduct,
  currency,
  onSelectSlide,
  onPauseChange,
  onOpenQuickView,
  onAddToCart
}: HeroSectionProps) {
  const [hero3DMode, setHero3DMode] = useState(false);
  const currentHeroSlide = HERO_SLIDES[heroSlideIdx];
  const { ref: parallaxRef, offsetY: heroParallaxY } = useScrollParallax<HTMLElement>(26);
  const { tilt, bind } = useSpringTilt({
    maxDeg: 3.4,
    damping: 0.065,
    ambientDrift: true
  });

  return (
    <section
      ref={parallaxRef}
      aria-label="Editorial Showcase"
      className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Editorial Column (5 Cols) — Staggered Entrance + Gentle Scroll Parallax */}
        <div
          className="lg:col-span-5 space-y-8 z-10 will-change-transform"
          style={{ transform: `translate3d(0, ${(heroParallaxY * 0.55).toFixed(2)}px, 0)` }}
        >
          <div
            style={{ animationDelay: '960ms' }}
            className="ao-hero-stagger inline-flex items-center space-x-3 border-b border-[#2B1C1E]/20 pb-2.5"
          >
            <HallmarkGlyph className="w-3 h-3 text-[#BC8379]" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-[#2B1C1E]/75">
              Edition IV · Autumn / Winter 2026
            </span>
          </div>

          <h1
            style={{ animationDelay: '1080ms' }}
            className="ao-hero-stagger font-serif text-5xl sm:text-6xl lg:text-[66px] leading-[1.06] font-light tracking-tight text-[#2B1C1E]"
          >
            Sculpted by Light, <br />
            <span className="italic font-normal text-[#543A3D]">Worn in Silence.</span>
          </h1>

          <p
            style={{ animationDelay: '1200ms' }}
            className="ao-hero-stagger text-sm md:text-[15px] font-light text-[#2B1C1E]/80 leading-[1.75] max-w-md"
          >
            Hand-cast in recycled 750 solid gold and traceable laboratory-grown stones. Quiet architectural silhouettes proportioned for decades of daily permanence across India.
          </p>

          <div
            style={{ animationDelay: '1320ms' }}
            className="ao-hero-stagger flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 pt-2"
          >
            <a
              href="#collections"
              className="ao-btn-luxe inline-flex items-center justify-center bg-[#2B1C1E] text-[#FAF1F0] px-8 py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] group"
            >
              <span>Explore Collections</span>
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#atelier"
              className="ao-btn-luxe inline-flex items-center justify-center border border-[#2B1C1E]/30 px-8 py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:border-[#2B1C1E] hover:bg-[#F0DFDD]/50"
            >
              The Atelier Stack
            </a>
          </div>

          <div
            style={{ animationDelay: '1440ms' }}
            className="ao-hero-stagger pt-4 border-t border-[#2B1C1E]/10 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/55 max-w-md"
          >
            <span>Prayagraj Foundry · Mumbai Assay</span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#9A6058] hover:text-[#2B1C1E] transition-colors font-medium group"
            >
              <Instagram className="w-3.5 h-3.5 stroke-[1.6] group-hover:scale-110 transition-transform" />
              <span>{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </div>

        {/* Right 3D Layered Editorial Museum Vitrine (7 Cols) — Counter-Depth Parallax */}
        <div
          className="lg:col-span-7 relative will-change-transform"
          onMouseEnter={() => onPauseChange(true)}
          onMouseMove={hero3DMode ? undefined : bind.onMouseMove}
          onMouseLeave={() => {
            if (!hero3DMode) onPauseChange(false);
            bind.onMouseLeave();
          }}
          style={{
            perspective: '1400px',
            transform: `translate3d(0, ${(-heroParallaxY * 0.48).toFixed(2)}px, 0)`
          }}
        >
          <div
            className="relative ao-preserve-3d will-change-transform"
            style={{
              transform: hero3DMode
                ? 'none'
                : `rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`
            }}
          >
            {/* Plane 1 (Deep Layer): Offset Architectural Rose-Gold Frame */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full border border-[#BC8379]/40 pointer-events-none hidden sm:block"
              style={{
                transform: `translate3d(${(-tilt.shiftX * 1.1).toFixed(2)}px, ${(-tilt.shiftY * 1.1).toFixed(2)}px, -34px)`
              }}
            />

            {/* Plane 2 (Mid Layer): Animated Photographic Vitrine OR Live 360° 3D Mode */}
            <div className="relative w-full h-[520px] md:h-[660px] overflow-hidden border border-[#2B1C1E]/15 bg-[#ECD8D6] shadow-[0_30px_60px_-24px_rgba(43,28,30,0.28)] ao-hero-curtain">
              {hero3DMode ? (
                <Jewelry3DCanvas
                  category={currentHeroProduct.category}
                  metal="18k Rose Gold"
                  autoSpin={true}
                  loupeZoom={false}
                  className="w-full h-full"
                />
              ) : (
                <>
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      aria-hidden={idx !== heroSlideIdx}
                      style={{ opacity: idx === heroSlideIdx ? 1 : 0 }}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-out pointer-events-none ${
                        idx === heroSlideIdx ? 'ao-ken-burns' : ''
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        loading={idx === heroSlideIdx ? 'eager' : 'lazy'}
                        onError={handleImgError}
                        style={{
                          transform:
                            idx === heroSlideIdx
                              ? `scale(1.03) translate3d(${(tilt.shiftX * 0.9).toFixed(2)}px, ${(tilt.shiftY * 0.9).toFixed(2)}px, 0)`
                              : 'scale(1.06)'
                        }}
                        className="w-full h-full object-cover object-center ao-ease-image"
                      />
                    </div>
                  ))}

                  {/* Periodic Champagne Diamond-Light Specular Sweep */}
                  <div className="ao-studio-glint" aria-hidden="true" />

                  {/* Pointer-reactive Studio Softbox Sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(540px circle at ${tilt.lightX.toFixed(1)}% ${tilt.lightY.toFixed(1)}%, rgba(255, 248, 244, 0.24), transparent 62%)`
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B1C1E]/32 via-transparent to-[#2B1C1E]/10 pointer-events-none" />
                </>
              )}
            </div>

            {/* Plane 3 (Foreground Elevated): Plate Switcher + Live 360° Toggle */}
            <div
              className="absolute top-6 right-6 z-20 flex items-center bg-[#FAF1F0]/92 backdrop-blur-md border border-[#2B1C1E]/15 shadow-[0_12px_28px_-10px_rgba(43,28,30,0.22)]"
              style={{ transform: 'translateZ(34px)' }}
            >
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setHero3DMode(false);
                    onPauseChange(false);
                    onSelectSlide(idx);
                  }}
                  className={`ao-num px-3.5 py-2 text-[10px] tracking-[0.2em] transition-colors ${
                    !hero3DMode && idx === heroSlideIdx
                      ? 'bg-[#2B1C1E] text-[#FAF1F0] font-medium'
                      : 'text-[#2B1C1E]/65 hover:text-[#2B1C1E]'
                  }`}
                  aria-label={`View editorial plate ${slide.plateNumber}`}
                >
                  {slide.plateNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const next = !hero3DMode;
                  setHero3DMode(next);
                  onPauseChange(next);
                }}
                className={`px-3 py-2 border-l border-[#2B1C1E]/15 text-[10px] uppercase tracking-[0.18em] flex items-center gap-1 transition-colors ${
                  hero3DMode
                    ? 'bg-[#9A6058] text-[#FAF1F0] font-medium'
                    : 'text-[#9A6058] hover:bg-[#F3E4E2]'
                }`}
                aria-label="Toggle live 360 degree 3D ring view"
              >
                <Move3d className="w-3.5 h-3.5" />
                <span>360°</span>
              </button>
            </div>

          </div>
        </div>

        {/* Product info card — below image on mobile, overlaid bottom-left on sm+ */}
        <div
          className="sm:absolute sm:bottom-6 sm:left-6 sm:max-w-[330px] sm:z-20 bg-[#FAF1F0]/94 backdrop-blur-md p-5 sm:p-6 border border-[#2B1C1E]/15 shadow-[0_24px_48px_-16px_rgba(43,28,30,0.28)] mx-0"
          style={{ transform: 'translateZ(42px)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#9A6058]">
              {currentHeroSlide.eyebrow}
            </span>
            <span className="font-mono-spec text-[9px] text-[#2B1C1E]/45">
              {currentHeroProduct.sku}
            </span>
          </div>
          <h2 className="font-serif text-xl font-normal mb-1.5 leading-snug">
            {currentHeroSlide.title}
          </h2>
          <p className="text-xs text-[#2B1C1E]/70 mb-4 font-light leading-relaxed">
            {currentHeroSlide.specLine}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[#2B1C1E]/10">
            <button
              type="button"
              onClick={() => onOpenQuickView(currentHeroProduct)}
              className="ao-num text-[10px] uppercase tracking-[0.22em] font-medium underline underline-offset-4 hover:text-[#9A6058] transition-colors"
            >
              Inspect Piece — {formatPrice(currentHeroProduct.basePriceInr, currency)}
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(currentHeroProduct)}
              className="text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 hover:text-[#2B1C1E]"
            >
              + Bag
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
