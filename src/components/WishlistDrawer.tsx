import { X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { CurrencyCode, MetalFinish, Product } from '../types/storefront';
import { formatPrice, getAdjustedPriceInr, handleImgError } from '../utils/pricing';

interface WishlistDrawerProps {
  open: boolean;
  wishlist: number[];
  cardMetals: Record<number, MetalFinish>;
  currency: CurrencyCode;
  onClose: () => void;
  onOpenQuickView: (prod: Product, preferredMetal?: MetalFinish) => void;
  onAddToCart: (prod: Product, metal?: MetalFinish, size?: string) => void;
  onToggleWishlist: (id: number) => void;
}

/** Private archive wishlist drawer with alloy-specific valuations and add-to-bag actions. */
export function WishlistDrawer({
  open,
  wishlist,
  cardMetals,
  currency,
  onClose,
  onOpenQuickView,
  onAddToCart,
  onToggleWishlist
}: WishlistDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FAF1F0] h-full p-7 md:p-8 flex flex-col justify-between border-l border-[#2B1C1E]/15"
      >
        <div className="flex flex-col flex-grow min-h-0">
          <div className="flex justify-between items-center mb-8 border-b border-[#2B1C1E]/12 pb-4">
            <span className="font-serif text-xl tracking-[0.16em] uppercase">
              Saved Pieces ({wishlist.length})
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close saved pieces"
              className="text-[#2B1C1E]"
            >
              <X className="w-5 h-5 stroke-[1.4]" />
            </button>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 text-[#2B1C1E]/60 font-light text-sm my-auto">
              No saved pieces in your private archive.
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto pr-1">
              {wishlist.map((id) => {
                const prod = PRODUCTS.find((p) => p.id === id);
                if (!prod) return null;
                const chosenMetal = cardMetals[prod.id] || '18k Yellow Gold';
                const priceInr = getAdjustedPriceInr(prod.basePriceInr, chosenMetal);

                return (
                  <div
                    key={id}
                    className="flex space-x-4 border-b border-[#2B1C1E]/10 pb-5 items-center"
                  >
                    <img
                      src={prod.image1}
                      alt={prod.name}
                      onError={handleImgError}
                      className="w-20 h-24 object-cover border border-[#2B1C1E]/10 bg-[#F0DFDD] cursor-pointer"
                      onClick={() => {
                        onClose();
                        onOpenQuickView(prod, chosenMetal);
                      }}
                    />
                    <div className="flex-grow min-w-0">
                      <span className="font-mono-spec text-[9px] text-[#9A6058] block">
                        {prod.sku}
                      </span>
                      <h4 className="font-serif text-sm mb-0.5 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-[#2B1C1E]/60 mb-1.5">{chosenMetal}</p>
                      <span className="ao-num text-xs font-medium tracking-wider">
                        {formatPrice(priceInr, currency)}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <button
                        type="button"
                        onClick={() => onAddToCart(prod, chosenMetal, prod.sizes[0])}
                        className="bg-[#2B1C1E] text-[#FAF1F0] text-[10px] uppercase tracking-[0.16em] px-3.5 py-2 hover:bg-[#9A6058] transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(prod.id)}
                        className="text-[9px] uppercase tracking-[0.18em] text-[#2B1C1E]/50 hover:text-[#2B1C1E]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#2B1C1E]/10 pt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-[#2B1C1E]/70 hover:text-[#9A6058]"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

