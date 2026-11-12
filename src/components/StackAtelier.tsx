import { Check, Plus } from 'lucide-react';
import { METAL_OPTIONS } from '../data/catalog';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useSpringTilt } from '../hooks/useSpringTilt';
import { CurrencyCode, MetalFinish, MetalOption, Product } from '../types/storefront';
import { formatPrice, getAdjustedPriceInr, handleImgError } from '../utils/pricing';

interface StackAtelierProps {
  stackCatalog: Product[];
  activeStackIndex: number;
  activeStackPiece: Product;
  activeStackMetalMeta: MetalOption;
  selectedStackPieces: Product[];
  stackedIds: number[];
  stackMetal: MetalFinish;
  stackViewMode: 'editorial' | 'blueprint';
  stackTotalInr: number;
  stackTotalGrams: number;
  currency: CurrencyCode;
  onSelectStackIndex: (idx: number) => void;
  onToggleInclusion: (id: number) => void;
  onSelectStackMetal: (metal: MetalFinish) => void;
  onSelectViewMode: (mode: 'editorial' | 'blueprint') => void;
  onAddFullStackToBag: () => void;
  onAddSingleToBag: (product: Product, metal: MetalFinish, size: string) => void;
  onOpenQuickView: (product: Product, metal: MetalFinish) => void;
}

/** Interactive stacking atelier workbench and 3D-staged proportion blueprint. */
export function StackAtelier({
  stackCatalog,
  activeStackIndex,
  activeStackPiece,
  activeStackMetalMeta,
  selectedStackPieces,
  stackedIds,
  stackMetal,
  stackViewMode,
  stackTotalInr,
  stackTotalGrams,
  currency,
  onSelectStackIndex,
  onToggleInclusion,
  onSelectStackMetal,
  onSelectViewMode,
  onAddFullStackToBag,
  onAddSingleToBag,
  onOpenQuickView
}: StackAtelierProps) {
  const { tilt, bind } = useSpringTilt({ maxDeg: 2.6, damping: 0.075 });
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.12);

  return (
    <section
      id="atelier"
      ref={ref}
      data-visible={visible}
      aria-labelledby="atelier-heading"
      className="py-24 md:py-32 bg-[#F3E4E2] border-y border-[#2B1C1E]/10 ao-reveal"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#9A6058] block mb-3">
              The Stacking Atelier
            </span>
            <h2 id="atelier-heading" className="font-serif text-3xl md:text-5xl font-light">
              Curated Composition
            </h2>
          </div>
          <p className="text-xs text-[#2B1C1E]/70 max-w-md font-light leading-relaxed">
            Assemble a unified precious-metal stack engineered with matching gallery heights. Inspect technical tolerances or add your composition to bag in one motion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 5-Column Workbench List */}
          <div className="lg:col-span-5 space-y-3.5">
            {stackCatalog.map((piece, index) => {
              const isFocused = activeStackIndex === index;
              const isIncluded = stackedIds.includes(piece.id);
              const pieceInr = getAdjustedPriceInr(piece.basePriceInr, stackMetal);

              return (
                <div
                  key={piece.id}
                  onClick={() => onSelectStackIndex(index)}
                  className={`p-5 border transition-colors duration-300 cursor-pointer ${
                    isFocused
                      ? 'bg-[#FAF1F0] border-[#2B1C1E]'
                      : 'bg-transparent border-[#2B1C1E]/15 hover:border-[#2B1C1E]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="ao-num text-[9px] uppercase tracking-[0.28em] text-[#9A6058]">
                          0{index + 1} · {piece.stackRole}
                        </span>
                        <span className="font-mono-spec text-[9px] text-[#2B1C1E]/45">
                          {piece.stackWidthMm} mm · {piece.weightGrams} g
                        </span>
                      </div>
                      <h3 className="font-serif text-lg leading-snug">{piece.name}</h3>
                      <p className="text-xs text-[#2B1C1E]/60 font-light">{piece.caratInfo}</p>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-2">
                      <span className="ao-num text-xs tracking-wider font-medium block">
                        {formatPrice(pieceInr, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleInclusion(piece.id);
                        }}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] border transition-colors ${
                          isIncluded
                            ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                            : 'bg-transparent text-[#2B1C1E]/70 border-[#2B1C1E]/25 hover:border-[#2B1C1E]'
                        }`}
                      >
                        {isIncluded ? (
                          <>
                            <Check className="w-2.5 h-2.5" />
                            <span>In Stack</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-2.5 h-2.5" />
                            <span>Include</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Stack Summary & Actions */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.18em] text-[#2B1C1E]/70">
                <span className="ao-num">
                  {selectedStackPieces.length}{' '}
                  {selectedStackPieces.length === 1 ? 'Piece' : 'Pieces'} ·{' '}
                  {stackTotalGrams.toFixed(1)} g Total
                </span>
                <span className="ao-num font-medium text-[#2B1C1E]">
                  {formatPrice(stackTotalInr, currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={onAddFullStackToBag}
                className="ao-num w-full bg-[#2B1C1E] text-[#FAF1F0] py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors duration-300"
              >
                Add Curated Stack ({selectedStackPieces.length}) — {formatPrice(stackTotalInr, currency)}
              </button>

              <button
                type="button"
                onClick={() =>
                  onAddSingleToBag(
                    activeStackPiece,
                    stackMetal,
                    activeStackPiece.sizes.includes('IN 12') ? 'IN 12' : activeStackPiece.sizes[0]
                  )
                }
                className="w-full border border-[#2B1C1E]/25 py-3 text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/80 hover:border-[#2B1C1E] hover:text-[#2B1C1E] transition-colors"
              >
                Add Focused Piece Only —{' '}
                {formatPrice(getAdjustedPriceInr(activeStackPiece.basePriceInr, stackMetal), currency)}
              </button>
            </div>
          </div>

          {/* Right 7-Column 3D Staged Preview & Blueprint Stage */}
          <div className="lg:col-span-7 space-y-4" style={{ perspective: '1300px' }}>
            <div
              {...bind}
              className="relative aspect-[4/3] bg-[#ECD8D6] border border-[#2B1C1E]/15 ao-preserve-3d will-change-transform shadow-[0_24px_50px_-22px_rgba(43,28,30,0.22)]"
              style={{
                transform: `rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`
              }}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={activeStackPiece.image1}
                  alt={`${activeStackPiece.name} — Atelier Stack Preview`}
                  loading="lazy"
                  onError={handleImgError}
                  style={{
                    filter: activeStackMetalMeta.filterCss,
                    transform: `scale(1.03) translate3d(${(tilt.shiftX * 0.65).toFixed(2)}px, ${(tilt.shiftY * 0.65).toFixed(2)}px, 0)`
                  }}
                  className="w-full h-full object-cover ao-ease-image"
                />

                {/* Soft Studio Specular Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: tilt.isActive ? 1 : 0,
                    background: `radial-gradient(420px circle at ${tilt.lightX.toFixed(1)}% ${tilt.lightY.toFixed(1)}%, rgba(255, 248, 244, 0.2), transparent 60%)`
                  }}
                />

                {/* Proportion Spec Blueprint Overlay when toggled */}
                {stackViewMode === 'blueprint' && (
                  <div className="absolute inset-0 bg-[#2B1C1E]/78 backdrop-blur-[2px] text-[#FAF1F0] p-6 md:p-10 flex flex-col justify-between ao-panel-enter">
                    <div className="flex items-center justify-between border-b border-[#FAF1F0]/15 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.28em] text-[#D9A79C] block">
                          Atelier Proportion Study
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#FAF1F0] mt-1">
                          {activeStackPiece.name}
                        </h3>
                      </div>
                      <span className="font-mono-spec text-xs text-[#FAF1F0]/70">
                        {activeStackPiece.sku}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-auto py-4">
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Selected Alloy
                        </span>
                        <span className="text-xs font-medium">{activeStackMetalMeta.grade}</span>
                      </div>
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Metal Mass
                        </span>
                        <span className="ao-num text-xs font-medium">
                          {activeStackPiece.weightGrams} grams solid
                        </span>
                      </div>
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Dimensions
                        </span>
                        <span className="ao-num text-xs font-medium">
                          {activeStackPiece.dimensions}
                        </span>
                      </div>
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Stone Calibration
                        </span>
                        <span className="text-xs font-medium">{activeStackPiece.caratInfo}</span>
                      </div>
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Hallmark
                        </span>
                        <span className="text-xs font-medium">{activeStackPiece.hallmark}</span>
                      </div>
                      <div className="border-l border-[#D9A79C]/60 pl-4">
                        <span className="text-[9px] uppercase tracking-[0.24em] text-[#FAF1F0]/55 block mb-1">
                          Stack Span
                        </span>
                        <span className="ao-num text-xs font-medium">
                          {selectedStackPieces
                            .reduce((s, p) => s + (p.stackWidthMm || 2), 0)
                            .toFixed(1)}{' '}
                          mm combined
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#FAF1F0]/15 pt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#FAF1F0]/70">
                      <span>Zero-gap flush gallery clearance verified</span>
                      <button
                        type="button"
                        onClick={() => onOpenQuickView(activeStackPiece, stackMetal)}
                        className="text-[#D9A79C] underline underline-offset-4 hover:text-[#FAF1F0]"
                      >
                        Open Full Dossier →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Elevated Controls inside Preview Frame */}
              <div
                className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 z-10"
                style={{ transform: 'translateZ(24px)' }}
              >
                <div className="bg-[#FAF1F0]/92 backdrop-blur-sm px-3.5 py-2 border border-[#2B1C1E]/15">
                  <span className="ao-num text-[9px] uppercase tracking-[0.22em] font-medium">
                    {activeStackPiece.sku} · {activeStackMetalMeta.short} · {activeStackPiece.stackWidthMm} mm
                  </span>
                </div>

                <div className="flex items-center bg-[#FAF1F0]/92 backdrop-blur-sm border border-[#2B1C1E]/15">
                  <button
                    type="button"
                    onClick={() => onSelectViewMode('editorial')}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                      stackViewMode === 'editorial'
                        ? 'bg-[#2B1C1E] text-[#FAF1F0]'
                        : 'text-[#2B1C1E]/70 hover:text-[#2B1C1E]'
                    }`}
                  >
                    Editorial
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectViewMode('blueprint')}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors ${
                      stackViewMode === 'blueprint'
                        ? 'bg-[#2B1C1E] text-[#FAF1F0]'
                        : 'text-[#2B1C1E]/70 hover:text-[#2B1C1E]'
                    }`}
                  >
                    Specs
                  </button>
                </div>
              </div>

              {/* Elevated Bottom Active Composition Tray */}
              {stackViewMode === 'editorial' && (
                <div
                  className="absolute bottom-5 left-5 right-5 bg-[#FAF1F0]/94 backdrop-blur-md border border-[#2B1C1E]/15 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_18px_36px_-14px_rgba(43,28,30,0.22)]"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="flex items-center space-x-2.5 overflow-x-auto">
                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#9A6058] pr-1 flex-shrink-0">
                      Tray ({selectedStackPieces.length}):
                    </span>
                    {selectedStackPieces.map((item) => {
                      const catalogIdx = stackCatalog.findIndex((c) => c.id === item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectStackIndex(catalogIdx)}
                          className={`flex items-center space-x-2 pr-2.5 border transition-colors flex-shrink-0 ${
                            activeStackPiece.id === item.id
                              ? 'border-[#2B1C1E] bg-[#F0DFDD]'
                              : 'border-[#2B1C1E]/15 bg-transparent hover:border-[#2B1C1E]/40'
                          }`}
                        >
                          <img
                            src={item.image1}
                            alt={item.name}
                            onError={handleImgError}
                            style={{ filter: activeStackMetalMeta.filterCss }}
                            className="w-7 h-7 object-cover"
                          />
                          <span className="text-[10px] font-serif whitespace-nowrap">
                            {item.name.replace(/^The\s+/i, '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Global Stack Alloy Switcher */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {METAL_OPTIONS.map((metal) => (
                      <button
                        key={metal.name}
                        type="button"
                        onClick={() => onSelectStackMetal(metal.name)}
                        title={`Preview stack in ${metal.name}`}
                        className={`flex items-center space-x-1.5 px-2 py-1 border text-[9px] uppercase tracking-[0.15em] transition-colors ${
                          stackMetal === metal.name
                            ? 'border-[#2B1C1E] bg-[#2B1C1E] text-[#FAF1F0]'
                            : 'border-[#2B1C1E]/20 text-[#2B1C1E]/75 hover:border-[#2B1C1E]'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: metal.swatch }}
                        />
                        <span className="hidden sm:inline">{metal.short}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
