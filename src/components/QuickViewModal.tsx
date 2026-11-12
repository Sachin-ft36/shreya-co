import { useEffect, useState } from 'react';
import { Heart, MapPin, Minus, Move3d, Plus, Ruler, X, ZoomIn, ZoomOut } from 'lucide-react';
import { METAL_OPTIONS } from '../data/catalog';
import { CurrencyCode, MetalFinish, Product } from '../types/storefront';
import { lookupIndianPincode } from '../utils/delivery';
import { formatPrice, getAdjustedPriceInr, handleImgError } from '../utils/pricing';
import { Jewelry3DCanvas } from './Jewelry3DCanvas';

interface QuickViewModalProps {
  item: Product | null;
  qvMetal: MetalFinish;
  qvSize: string;
  qvImageIdx: 0 | 1;
  qvTab: 'specs' | 'provenance';
  showSizeGuide: boolean;
  wishlist: number[];
  currency: CurrencyCode;
  onClose: () => void;
  onSelectMetal: (metal: MetalFinish) => void;
  onSelectSize: (size: string) => void;
  onSelectImageIdx: (idx: 0 | 1) => void;
  onSelectTab: (tab: 'specs' | 'provenance') => void;
  onToggleSizeGuide: () => void;
  onAddToCart: (product: Product, metal: MetalFinish, size: string, quantity?: number) => void;
  onBuyNow: (product: Product, metal: MetalFinish, size: string, quantity?: number) => void;
  onToggleWishlist: (id: number) => void;
}

/** Product dossier quick-view modal with Indian ring sizing, PIN ETA checker, quantity, Add to Bag & Buy Now. */
export function QuickViewModal({
  item,
  qvMetal,
  qvSize,
  qvImageIdx,
  qvTab,
  showSizeGuide,
  wishlist,
  currency,
  onClose,
  onSelectMetal,
  onSelectSize,
  onSelectImageIdx,
  onSelectTab,
  onToggleSizeGuide,
  onAddToCart,
  onBuyNow,
  onToggleWishlist
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [pinInput, setPinInput] = useState('400001');
  const [checkedPin, setCheckedPin] = useState('400001');
  const [show3D, setShow3D] = useState(false);
  const [loupe3D, setLoupe3D] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setShow3D(false);
    setLoupe3D(false);
  }, [item?.id]);

  if (!item) return null;

  const unitPriceInr = getAdjustedPriceInr(item.basePriceInr, qvMetal);
  const pinResult = lookupIndianPincode(checkedPin);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/72 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF1F0] max-w-4xl w-full p-6 md:p-11 relative border border-[#2B1C1E]/20 my-auto ao-panel-enter"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product dossier"
          className="absolute top-6 right-6 text-[#2B1C1E] hover:text-[#9A6058] p-1"
        >
          <X className="w-6 h-6 stroke-[1.4]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          {/* Left Dual-Angle + 360° 3D Gallery (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[4/5] bg-[#ECD8D6] border border-[#2B1C1E]/12 overflow-hidden">
              {show3D ? (
                <>
                  <Jewelry3DCanvas
                    category={item.category}
                    metal={qvMetal}
                    autoSpin={!loupe3D}
                    loupeZoom={loupe3D}
                    className="w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => setLoupe3D((prev) => !prev)}
                    className={`absolute bottom-3 right-3 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] border flex items-center gap-1.5 transition-colors ${
                      loupe3D
                        ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                        : 'bg-[#FAF1F0]/90 text-[#2B1C1E] border-[#2B1C1E]/25 hover:border-[#2B1C1E]'
                    }`}
                  >
                    {loupe3D ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                    <span>{loupe3D ? '1.0× Studio' : '2.2× Loupe'}</span>
                  </button>
                </>
              ) : (
                <img
                  src={qvImageIdx === 0 ? item.image1 : item.image2}
                  alt={item.name}
                  onError={handleImgError}
                  style={{
                    filter: METAL_OPTIONS.find((m) => m.name === qvMetal)?.filterCss || undefined
                  }}
                  className="w-full h-full object-cover ao-ease-image"
                />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { idx: 0 as const, label: '01 Studio', src: item.image1 },
                { idx: 1 as const, label: '02 Worn', src: item.image2 }
              ].map((view) => (
                <button
                  key={view.idx}
                  type="button"
                  onClick={() => {
                    setShow3D(false);
                    onSelectImageIdx(view.idx);
                  }}
                  className={`p-2 border text-left flex items-center space-x-2 transition-colors ${
                    !show3D && qvImageIdx === view.idx
                      ? 'border-[#2B1C1E] bg-[#F0DFDD]'
                      : 'border-[#2B1C1E]/15 hover:border-[#2B1C1E]/40'
                  }`}
                >
                  <img
                    src={view.src}
                    alt={view.label}
                    onError={handleImgError}
                    className="w-8 h-9 object-cover flex-shrink-0"
                  />
                  <span className="text-[9px] uppercase tracking-[0.14em] leading-tight">
                    {view.label}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShow3D(true)}
                className={`p-2 border text-left flex items-center space-x-2 transition-colors ${
                  show3D
                    ? 'border-[#2B1C1E] bg-[#F0DFDD]'
                    : 'border-[#2B1C1E]/15 hover:border-[#2B1C1E]/40'
                }`}
              >
                <span className="w-8 h-9 bg-[#2B1C1E]/8 border border-[#2B1C1E]/15 flex items-center justify-center flex-shrink-0">
                  <Move3d className="w-4 h-4 text-[#9A6058]" />
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] leading-tight">
                  03 360° 3D
                </span>
              </button>
            </div>
          </div>

          {/* Right Configuration & Technical Specifications (7 Cols) */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center space-x-3 mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#9A6058]">
                  Atelier Dossier
                </span>
                <span className="font-mono-spec text-[10px] text-[#2B1C1E]/45">{item.sku}</span>
              </div>
              <h3 className="font-serif text-3xl font-light mb-1">{item.name}</h3>
              <p className="text-xs text-[#2B1C1E]/65 font-light">{item.subtitle}</p>
            </div>

            <div className="flex items-baseline justify-between border-y border-[#2B1C1E]/12 py-3">
              <div>
                <span className="ao-num text-2xl font-normal tracking-wide block">
                  {formatPrice(unitPriceInr * quantity, currency)}
                </span>
                <span className="text-[10px] text-[#2B1C1E]/55">
                  MRP incl. of 3% GST &amp; Insured Transit
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/60">
                {item.leadTime}
              </span>
            </div>

            <p className="text-xs text-[#2B1C1E]/80 font-light leading-relaxed">
              {item.description}
            </p>

            {/* Metal Finish Selector */}
            <div>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65 mb-2">
                Alloy Finish: <strong className="text-[#2B1C1E] font-medium">{qvMetal}</strong>
              </span>
              <div className="grid grid-cols-3 gap-2">
                {METAL_OPTIONS.map((metal) => (
                  <button
                    key={metal.name}
                    type="button"
                    onClick={() => onSelectMetal(metal.name)}
                    className={`px-3 py-2 border text-left flex items-center space-x-2 transition-colors ${
                      qvMetal === metal.name
                        ? 'border-[#2B1C1E] bg-[#F3E4E2]'
                        : 'border-[#2B1C1E]/18 hover:border-[#2B1C1E]/45'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 border border-[#2B1C1E]/20"
                      style={{ backgroundColor: metal.swatch }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.14em] truncate">
                      {metal.short}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Quantity Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65">
                    {item.sizeLabel}: <strong className="text-[#2B1C1E] font-medium">{qvSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={onToggleSizeGuide}
                    className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-[0.18em] text-[#9A6058] hover:text-[#2B1C1E]"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>{showSizeGuide ? 'Hide Guide' : 'Sizing Notes'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSelectSize(size)}
                      className={`ao-num px-3 py-1.5 border text-[11px] tracking-[0.14em] transition-colors ${
                        qvSize === size
                          ? 'border-[#2B1C1E] bg-[#2B1C1E] text-[#FAF1F0]'
                          : 'border-[#2B1C1E]/20 text-[#2B1C1E]/80 hover:border-[#2B1C1E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-4">
                <span className="block text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/65 mb-2">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-[#2B1C1E]/25 bg-[#FDF8F7]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="px-3 py-2 text-[#2B1C1E]/75 hover:text-[#2B1C1E]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="ao-num px-3 text-xs font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="px-3 py-2 text-[#2B1C1E]/75 hover:text-[#2B1C1E]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {showSizeGuide && (
              <div className="p-3 bg-[#F3E4E2] border border-[#2B1C1E]/12 text-[11px] text-[#2B1C1E]/75 font-light space-y-1">
                <p>
                  <strong>Indian Ring Internal Diameter:</strong> IN 10 (15.9 mm) · IN 12 (16.5 mm) · IN 14 (17.2 mm) · IN 16 (17.8 mm).
                </p>
                <p>
                  <strong>Cuffs:</strong> Measure just above the wrist bone. Complimentary first exchange pickup Pan-India.
                </p>
              </div>
            )}

            {/* Pin-Code Delivery ETA Check */}
            <div className="border border-[#2B1C1E]/12 bg-[#FDF8F7] p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.18em] text-[#2B1C1E]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#9A6058]" />
                  <span>Check Pan-India Delivery</span>
                </div>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="PIN Code"
                    className="ao-num w-24 border border-[#2B1C1E]/25 px-2.5 py-1 text-[11px] bg-[#FAF1F0] focus:outline-none focus:border-[#2B1C1E]"
                  />
                  <button
                    type="button"
                    onClick={() => setCheckedPin(pinInput)}
                    className="border border-[#2B1C1E]/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#2B1C1E]/75 font-light">
                {pinResult.valid
                  ? `Insured delivery to ${pinResult.city} (${checkedPin}) by ${pinResult.etaLabel} · Free Shipping`
                  : pinResult.serviceNote}
              </p>
            </div>

            {/* Technical Specs vs Provenance Tabs */}
            <div className="border-t border-[#2B1C1E]/12 pt-3">
              <div className="flex space-x-6 mb-2.5 text-[10px] uppercase tracking-[0.22em]">
                <button
                  type="button"
                  onClick={() => onSelectTab('specs')}
                  className={`pb-1 border-b ${
                    qvTab === 'specs'
                      ? 'border-[#BC8379] text-[#2B1C1E] font-medium'
                      : 'border-transparent text-[#2B1C1E]/50'
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('provenance')}
                  className={`pb-1 border-b ${
                    qvTab === 'provenance'
                      ? 'border-[#BC8379] text-[#2B1C1E] font-medium'
                      : 'border-transparent text-[#2B1C1E]/50'
                  }`}
                >
                  Hallmarks &amp; Care
                </button>
              </div>

              {qvTab === 'specs' ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div>
                    <span className="text-[#2B1C1E]/50 block text-[9px] uppercase tracking-[0.18em]">
                      Stone / Bullion
                    </span>
                    <span className="font-light">{item.caratInfo}</span>
                  </div>
                  <div>
                    <span className="text-[#2B1C1E]/50 block text-[9px] uppercase tracking-[0.18em]">
                      Gross Weight
                    </span>
                    <span className="ao-num font-light">{item.weightGrams} g</span>
                  </div>
                  <div>
                    <span className="text-[#2B1C1E]/50 block text-[9px] uppercase tracking-[0.18em]">
                      Proportions
                    </span>
                    <span className="ao-num font-light">{item.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[#2B1C1E]/50 block text-[9px] uppercase tracking-[0.18em]">
                      Hallmark
                    </span>
                    <span className="font-light">{item.hallmark}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-[#2B1C1E]/75 font-light leading-relaxed">
                  Cast from 100% certified bullion and accompanied by a signed BIS 750 HUID &amp; IGI assay dossier with GST invoice. Lifetime complimentary ultrasonic cleaning and prong tension inspection at our Mumbai and New Delhi salons.
                </p>
              )}
            </div>

            {/* Add to Bag, Buy Now & Wishlist */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(item, qvMetal, qvSize, quantity);
                  onClose();
                }}
                className="flex-grow border border-[#2B1C1E] bg-[#FDF8F7] text-[#2B1C1E] py-3.5 px-4 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#F3E4E2] transition-colors"
              >
                Add to Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  onBuyNow(item, qvMetal, qvSize, quantity);
                  onClose();
                }}
                className="ao-num flex-grow bg-[#2B1C1E] text-[#FAF1F0] py-3.5 px-5 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#9A6058] transition-colors"
              >
                Buy Now — {formatPrice(unitPriceInr * quantity, currency)}
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(item.id)}
                aria-label="Toggle wishlist"
                className="border border-[#2B1C1E]/30 px-4 hover:border-[#2B1C1E] transition-colors"
              >
                <Heart
                  className={`w-5 h-5 stroke-[1.4] ${
                    wishlist.includes(item.id) ? 'fill-[#BC8379] text-[#BC8379]' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
