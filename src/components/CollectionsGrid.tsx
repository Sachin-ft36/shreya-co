import { Eye, Heart, Minus, Plus } from 'lucide-react';
import { METAL_OPTIONS, PRODUCTS } from '../data/catalog';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useSpringTilt } from '../hooks/useSpringTilt';
import {
  CartItem,
  Category,
  CurrencyCode,
  MetalFinish,
  Product,
  SortOption
} from '../types/storefront';
import { formatPrice, getAdjustedPriceInr, handleImgError } from '../utils/pricing';

interface CollectionsGridProps {
  filteredProducts: Product[];
  selectedCategory: Category;
  sortBy: SortOption;
  currency: CurrencyCode;
  wishlist: number[];
  cartItems: CartItem[];
  cardMetals: Record<number, MetalFinish>;
  onSelectCategory: (cat: Category) => void;
  onSelectSort: (sort: SortOption) => void;
  onSelectCardMetal: (productId: number, metal: MetalFinish) => void;
  onToggleWishlist: (id: number) => void;
  onOpenQuickView: (product: Product, metal?: MetalFinish) => void;
  onAddToCart: (product: Product, metal?: MetalFinish, size?: string) => void;
  onBuyNow: (product: Product, metal?: MetalFinish, size?: string) => void;
  onUpdateCartQty: (key: string, delta: number) => void;
  onOpenCart: () => void;
}

const CATEGORIES: Category[] = ['All', 'Rings', 'Earrings', 'Bracelets', 'Necklaces'];

interface ProductVitrineCardProps {
  prod: Product;
  index: number;
  isWishlisted: boolean;
  selectedMetal: MetalFinish;
  cartItemInBag?: CartItem;
  currency: CurrencyCode;
  onSelectCardMetal: (productId: number, metal: MetalFinish) => void;
  onToggleWishlist: (id: number) => void;
  onOpenQuickView: (product: Product, metal?: MetalFinish) => void;
  onAddToCart: (product: Product, metal?: MetalFinish, size?: string) => void;
  onBuyNow: (product: Product, metal?: MetalFinish, size?: string) => void;
  onUpdateCartQty: (key: string, delta: number) => void;
  onOpenCart: () => void;
}

/** Tactile 3D vitrine product card with damped spring tilt, studio surface sheen & direct commerce bar. */
function ProductVitrineCard({
  prod,
  index,
  isWishlisted,
  selectedMetal,
  cartItemInBag,
  currency,
  onSelectCardMetal,
  onToggleWishlist,
  onOpenQuickView,
  onAddToCart,
  onBuyNow,
  onUpdateCartQty,
  onOpenCart
}: ProductVitrineCardProps) {
  const { tilt, bind } = useSpringTilt({ maxDeg: 4.4, damping: 0.085 });
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.1);

  const metalMeta = METAL_OPTIONS.find((m) => m.name === selectedMetal) || METAL_OPTIONS[0];
  const adjustedInr = getAdjustedPriceInr(prod.basePriceInr, selectedMetal);
  const defaultSize = prod.sizes[0];

  return (
    <article
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${(index % 3) * 95}ms` }}
      className={`group ao-reveal ${index % 3 === 1 ? 'md:mt-16' : ''}`}
    >
      <div
        {...bind}
        onClick={() => onOpenQuickView(prod, selectedMetal)}
        style={{ perspective: '1050px' }}
        className="mb-5 cursor-pointer"
      >
        <div
          className="relative aspect-[4/5] bg-[#ECD8D6] border border-[#2B1C1E]/15 ao-preserve-3d will-change-transform transition-shadow duration-500 group-hover:shadow-[0_24px_46px_-18px_rgba(43,28,30,0.28)]"
          style={{
            transform: `rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`
          }}
        >
          {/* Overflow-clipped photo chamber */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={prod.image1}
              alt={`${prod.name} — ${prod.subtitle} by Shreya & Co.`}
              loading="lazy"
              onError={handleImgError}
              style={{
                filter: metalMeta.filterCss,
                transform: `scale(1.02) translate3d(${(tilt.shiftX * 0.45).toFixed(2)}px, ${(tilt.shiftY * 0.45).toFixed(2)}px, 0)`
              }}
              className="w-full h-full object-cover ao-ease-image group-hover:opacity-0"
            />
            <img
              src={prod.image2}
              alt={`${prod.name} alternate proportion view`}
              loading="lazy"
              onError={handleImgError}
              style={{ filter: metalMeta.filterCss }}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 ao-ease-image"
            />

            {/* Soft glass specular reflection following pointer + diagonal luxury glint */}
            <div className="ao-card-glint" aria-hidden="true" />
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: tilt.isActive ? 1 : 0,
                background: `radial-gradient(360px circle at ${tilt.lightX.toFixed(1)}% ${tilt.lightY.toFixed(1)}%, rgba(255, 248, 244, 0.28), transparent 62%)`
              }}
            />
          </div>

          {/* Elevated foreground plaques */}
          <div
            className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-auto"
            style={{ transform: 'translateZ(20px)' }}
          >
            <span className="ao-num bg-[#FAF1F0]/92 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 border border-[#2B1C1E]/10 text-[#2B1C1E]">
              {prod.category} · {prod.weightGrams} g
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(prod.id);
              }}
              aria-label={
                isWishlisted ? `Remove ${prod.name} from saved pieces` : `Save ${prod.name}`
              }
              className="bg-[#FAF1F0]/92 backdrop-blur-sm p-2 rounded-full border border-[#2B1C1E]/10 text-[#2B1C1E] hover:text-[#BC8379] transition-colors"
            >
              <Heart
                className={`w-4 h-4 stroke-[1.4] ${
                  isWishlisted ? 'fill-[#BC8379] text-[#BC8379]' : 'text-[#2B1C1E]'
                }`}
              />
            </button>
          </div>

          {/* Quick Actions elevated in 3D space */}
          <div
            className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 flex space-x-2"
            style={{ transform: 'translateZ(26px)' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuickView(prod, selectedMetal);
              }}
              className="flex-grow bg-[#FAF1F0] text-[#2B1C1E] py-3 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#F3E4E2] transition-colors flex items-center justify-center space-x-1.5 border border-[#2B1C1E]/15"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Dossier</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(prod, selectedMetal, prod.sizes[0]);
              }}
              className="flex-grow bg-[#2B1C1E] text-[#FAF1F0] py-3 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-[#9A6058] transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" aria-label="Select alloy preview">
            {METAL_OPTIONS.map((metal) => (
              <button
                key={metal.name}
                type="button"
                title={metal.name}
                aria-label={`Preview ${prod.name} in ${metal.name}`}
                onClick={() => onSelectCardMetal(prod.id, metal.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedMetal === metal.name
                    ? 'border-[#2B1C1E] scale-110 ring-1 ring-[#BC8379] ring-offset-2 ring-offset-[#FAF1F0]'
                    : 'border-[#2B1C1E]/25 opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: metal.swatch }}
              />
            ))}
          </div>
          <span className="font-mono-spec text-[9px] text-[#2B1C1E]/45">{prod.sku}</span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div>
            <button
              type="button"
              onClick={() => onOpenQuickView(prod, selectedMetal)}
              className="text-left"
            >
              <h3 className="font-serif text-xl font-normal mb-0.5 hover:text-[#9A6058] transition-colors">
                {prod.name}
              </h3>
            </button>
            <p className="text-xs text-[#2B1C1E]/60 font-light tracking-wide">
              {metalMeta.short} · {prod.caratInfo}
            </p>
          </div>
          <span className="ao-num text-sm font-medium tracking-wider flex-shrink-0 pt-0.5">
            {formatPrice(adjustedInr, currency)}
          </span>
        </div>

        {/* Always-Accessible Commerce Bar (Works on Mobile & Desktop) */}
        <div className="pt-2 flex items-center gap-2">
          {cartItemInBag ? (
            <>
              <div className="inline-flex items-center justify-between border border-[#2B1C1E]/25 bg-[#FDF8F7] flex-1">
                <button
                  type="button"
                  onClick={() => onUpdateCartQty(cartItemInBag.key, -1)}
                  aria-label={`Decrease quantity of ${prod.name}`}
                  className="px-3 py-2.5 text-[#2B1C1E]/80 hover:text-[#2B1C1E]"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="ao-num text-[10px] uppercase tracking-[0.16em] font-medium">
                  In Bag ({cartItemInBag.quantity})
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateCartQty(cartItemInBag.key, 1)}
                  aria-label={`Increase quantity of ${prod.name}`}
                  className="px-3 py-2.5 text-[#2B1C1E]/80 hover:text-[#2B1C1E]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={onOpenCart}
                className="border border-[#2B1C1E] px-3.5 py-2.5 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-[#F3E4E2] transition-colors"
              >
                Bag
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(prod, selectedMetal, defaultSize)}
              className="flex-1 border border-[#2B1C1E]/30 bg-[#FDF8F7] text-[#2B1C1E] py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:border-[#2B1C1E] hover:bg-[#F3E4E2] transition-colors"
            >
              Add to Bag
            </button>
          )}
          <button
            type="button"
            onClick={() => onBuyNow(prod, selectedMetal, defaultSize)}
            className="flex-1 bg-[#2B1C1E] text-[#FAF1F0] py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#9A6058] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

/** Asymmetric 3-column curated jewellery showcase with live metal finish preview & filtering. */
export function CollectionsGrid({
  filteredProducts,
  selectedCategory,
  sortBy,
  currency,
  wishlist,
  cartItems,
  cardMetals,
  onSelectCategory,
  onSelectSort,
  onSelectCardMetal,
  onToggleWishlist,
  onOpenQuickView,
  onAddToCart,
  onBuyNow,
  onUpdateCartQty,
  onOpenCart
}: CollectionsGridProps) {
  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9A6058] block mb-3">
            Curated Archive
          </span>
          <h2 id="collections-heading" className="font-serif text-3xl md:text-5xl font-light tracking-tight">
            The Permanent Edits
          </h2>
        </div>
        <p className="text-xs text-[#2B1C1E]/70 max-w-sm font-light leading-relaxed">
          Cast in numbered batches across our Prayagraj and Mumbai ateliers. Select an alloy finish on any plate to preview proportion and GST-inclusive valuation.
        </p>
      </div>

      {/* Category Filter & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[#2B1C1E]/10 py-4 mb-14">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`text-[11px] uppercase tracking-[0.22em] transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? 'text-[#2B1C1E] font-semibold border-b border-[#BC8379] pb-0.5'
                    : 'text-[#2B1C1E]/55 hover:text-[#2B1C1E]'
                }`}
              >
                <span>{cat}</span>
                <span className="ao-num text-[9px] text-[#9A6058]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em]">
          <label htmlFor="sort-collections" className="text-[#2B1C1E]/50">
            Order:
          </label>
          <select
            id="sort-collections"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-transparent border border-[#2B1C1E]/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#2B1C1E] focus:outline-none focus:border-[#2B1C1E]"
          >
            <option value="curated">Curated Sequence</option>
            <option value="price-asc">Valuation: Low to High</option>
            <option value="price-desc">Valuation: High to Low</option>
          </select>
        </div>
      </div>

      {/* Staggered Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16">
        {filteredProducts.map((prod, index) => {
          const selectedMetal = cardMetals[prod.id] || '18k Yellow Gold';
          const defaultKey = `${prod.id}|${selectedMetal}|${prod.sizes[0]}`;
          const cartItemInBag = cartItems.find(
            (item) => item.key === defaultKey || (item.id === prod.id && item.metal === selectedMetal)
          );
          return (
            <ProductVitrineCard
              key={prod.id}
              prod={prod}
              index={index}
              isWishlisted={wishlist.includes(prod.id)}
              selectedMetal={selectedMetal}
              cartItemInBag={cartItemInBag}
              currency={currency}
              onSelectCardMetal={onSelectCardMetal}
              onToggleWishlist={onToggleWishlist}
              onOpenQuickView={onOpenQuickView}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onUpdateCartQty={onUpdateCartQty}
              onOpenCart={onOpenCart}
            />
          );
        })}
      </div>
    </section>
  );
}
