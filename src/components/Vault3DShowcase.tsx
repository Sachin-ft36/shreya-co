import { useState } from 'react';
import { Move3d, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { METAL_OPTIONS, PRODUCTS } from '../data/catalog';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { CurrencyCode, MetalFinish, Product } from '../types/storefront';
import { formatPrice, getAdjustedPriceInr } from '../utils/pricing';
import { Jewelry3DCanvas } from './Jewelry3DCanvas';

interface Vault3DShowcaseProps {
  currency: CurrencyCode;
  onAddToCart: (product: Product, metal: MetalFinish, size: string) => void;
  onBuyNow: (product: Product, metal: MetalFinish, size: string) => void;
  onOpenQuickView: (product: Product, metal: MetalFinish) => void;
}

/**
 * Interactive homepage Three.js 360-degree jewelry inspector with live alloy switching,
 * diamond clarity loupe zoom, and direct Add-to-Bag / Buy-Now actions.
 */
export function Vault3DShowcase({
  currency,
  onAddToCart,
  onBuyNow,
  onOpenQuickView
}: Vault3DShowcaseProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.12);
  const [selectedProdId, setSelectedProdId] = useState<number>(PRODUCTS[0]?.id ?? 201);
  const [selectedMetal, setSelectedMetal] = useState<MetalFinish>('18k Yellow Gold');
  const [autoSpin, setAutoSpin] = useState(true);
  const [loupeZoom, setLoupeZoom] = useState(false);
  const [resetTick, setResetTick] = useState(0);

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProdId) || PRODUCTS[0];
  const metalMeta = METAL_OPTIONS.find((m) => m.name === selectedMetal) || METAL_OPTIONS[0];
  const valuationInr = activeProduct ? getAdjustedPriceInr(activeProduct.basePriceInr, selectedMetal) : 0;

  if (!activeProduct) return null;

  return (
    <section
      ref={ref}
      data-visible={visible}
      aria-labelledby="vault-3d-heading"
      className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#2B1C1E]/10 ao-reveal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left 7 Cols: Live Interactive Three.js 360° Canvas */}
        <div className="lg:col-span-7">
          <div className="relative bg-gradient-to-b from-[#FDF8F7] via-[#F3E4E2] to-[#ECD8D6] border border-[#2B1C1E]/15 shadow-[0_26px_54px_-22px_rgba(43,28,30,0.22)] overflow-hidden">
            {/* Top Status Strip */}
            <div className="px-5 py-3.5 border-b border-[#2B1C1E]/10 flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
              <span className="inline-flex items-center space-x-2 text-[#9A6058] font-medium">
                <Move3d className="w-3.5 h-3.5" />
                <span>Real-Time 360° WebGL Studio · Drag to Rotate</span>
              </span>
              <span className="font-mono-spec text-[#2B1C1E]/55">{activeProduct.sku}</span>
            </div>

            <Jewelry3DCanvas
              category={activeProduct.category}
              metal={selectedMetal}
              autoSpin={autoSpin}
              loupeZoom={loupeZoom}
              resetSignal={resetTick}
              className="h-[380px] sm:h-[440px] md:h-[490px]"
            />

            {/* Bottom Control Bar */}
            <div className="px-4 sm:px-5 py-3 border-t border-[#2B1C1E]/10 bg-[#FAF1F0]/88 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAutoSpin((s) => !s)}
                  className="inline-flex items-center space-x-1.5 border border-[#2B1C1E]/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] hover:border-[#2B1C1E] transition-colors"
                >
                  {autoSpin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{autoSpin ? 'Pause Spin' : 'Auto 360°'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoupeZoom((z) => !z)}
                  className={`inline-flex items-center space-x-1.5 border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    loupeZoom
                      ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                      : 'border-[#2B1C1E]/25 hover:border-[#2B1C1E]'
                  }`}
                >
                  {loupeZoom ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                  <span>{loupeZoom ? '1.0× Studio' : '2.2× Clarity Loupe'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoupeZoom(false);
                  setResetTick((n) => n + 1);
                }}
                className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.18em] text-[#2B1C1E]/65 hover:text-[#2B1C1E] px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Angle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-Time Piece, Alloy & Purchase Configurator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <h2
              id="vault-3d-heading"
              className="font-serif text-3xl md:text-4xl font-light tracking-tight text-[#2B1C1E]"
            >
              Inspect Craft in 360°
            </h2>
            <p className="text-xs md:text-sm text-[#2B1C1E]/75 font-light leading-relaxed">
              Rotate every facet, prong, and mirror-finished bezel in real time. Switch between solid 750 gold alloys and 950 platinum or engage the 2.2× Clarity Loupe before reserving your piece.
            </p>
          </div>

          {/* Silhouette / Piece Picker */}
          <div className="space-y-2">
            <span className="block text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/60">
              Select Atelier Piece
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCTS.slice(0, 6).map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setSelectedProdId(prod.id)}
                  className={`p-2.5 border text-left transition-colors ${
                    prod.id === activeProduct.id
                      ? 'border-[#2B1C1E] bg-[#F3E4E2]'
                      : 'border-[#2B1C1E]/18 bg-[#FDF8F7]/70 hover:border-[#2B1C1E]/45'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#9A6058] block">
                    {prod.category}
                  </span>
                  <span className="font-serif text-xs block truncate">{prod.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Alloy Switcher */}
          <div className="space-y-2">
            <span className="block text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/60">
              Live Alloy Material: <strong className="text-[#2B1C1E]">{selectedMetal}</strong>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {METAL_OPTIONS.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setSelectedMetal(m.name)}
                  className={`px-3 py-2 border flex items-center space-x-2 transition-colors ${
                    selectedMetal === m.name
                      ? 'border-[#2B1C1E] bg-[#F3E4E2]'
                      : 'border-[#2B1C1E]/18 bg-[#FDF8F7]/70 hover:border-[#2B1C1E]/45'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-[#2B1C1E]/25 flex-shrink-0"
                    style={{ backgroundColor: m.swatch }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.14em] truncate">{m.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specs & Price */}
          <div className="border-y border-[#2B1C1E]/12 py-3.5 flex items-baseline justify-between">
            <div>
              <span className="ao-num text-2xl font-normal block">
                {formatPrice(valuationInr, currency)}
              </span>
              <span className="text-[10px] text-[#2B1C1E]/60">
                {metalMeta.grade} · {activeProduct.caratInfo} · {activeProduct.weightGrams} g
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenQuickView(activeProduct, selectedMetal)}
              className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 text-[#9A6058] hover:text-[#2B1C1E]"
            >
              Full Dossier
            </button>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onAddToCart(activeProduct, selectedMetal, activeProduct.sizes[0])}
              className="flex-1 border border-[#2B1C1E] bg-[#FDF8F7] py-3.5 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#F3E4E2] transition-colors"
            >
              Add to Bag
            </button>
            <button
              type="button"
              onClick={() => onBuyNow(activeProduct, selectedMetal, activeProduct.sizes[0])}
              className="flex-1 bg-[#2B1C1E] text-[#FAF1F0] py-3.5 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#9A6058] transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

