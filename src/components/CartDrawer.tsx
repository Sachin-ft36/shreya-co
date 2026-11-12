import { Gift, Heart, Lock, Minus, Package, Plus, Trash2, X } from 'lucide-react';
import { CartItem, Category, CurrencyCode } from '../types/storefront';
import { formatPrice, handleImgError } from '../utils/pricing';

interface CartDrawerProps {
  open: boolean;
  cartItems: CartItem[];
  totalCartCount: number;
  cartSubtotalInr: number;
  cartDiscountInr: number;
  cartTotalInr: number;
  appliedDiscountPct: number;
  clientCode: string;
  giftWrap: boolean;
  ordersCount: number;
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
  onClearCart: () => void;
  onSetClientCode: (code: string) => void;
  onApplyPromo: (overrideCode?: string) => void;
  onRemovePromo: () => void;
  onSetGiftWrap: (val: boolean) => void;
  onProceedToCheckout: () => void;
  onOpenOrders: () => void;
  onBrowseCollections: (cat: Category) => void;
}

/** Persistent slide-over shopping bag with item controls, gift wrap, promo codes & checkout launch. */
export function CartDrawer({
  open,
  cartItems,
  totalCartCount,
  cartSubtotalInr,
  cartDiscountInr,
  cartTotalInr,
  appliedDiscountPct,
  clientCode,
  giftWrap,
  ordersCount,
  currency,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onSetClientCode,
  onApplyPromo,
  onRemovePromo,
  onSetGiftWrap,
  onProceedToCheckout,
  onOpenOrders,
  onBrowseCollections
}: CartDrawerProps) {
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
          <div className="flex justify-between items-center mb-5 border-b border-[#2B1C1E]/12 pb-4">
            <div>
              <span className="font-serif text-xl tracking-[0.16em] uppercase block">
                Shopping Bag ({totalCartCount})
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058]">
                Free Insured Pan-India Transit · GST Invoice
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[9px] uppercase tracking-[0.18em] text-[#2B1C1E]/55 hover:text-[#2B1C1E]"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                className="text-[#2B1C1E]"
              >
                <X className="w-5 h-5 stroke-[1.4]" />
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-5 my-auto">
              <p className="text-[#2B1C1E]/65 font-light text-sm">
                Your shopping bag is currently empty.
              </p>
              <div className="flex flex-col space-y-2.5 items-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseCollections('All');
                  }}
                  className="bg-[#2B1C1E] text-[#FAF1F0] px-7 py-3.5 text-[10px] uppercase tracking-[0.22em] hover:bg-[#9A6058] transition-colors"
                >
                  Explore Collections
                </button>
                {ordersCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOrders();
                    }}
                    className="inline-flex items-center space-x-2 border border-[#2B1C1E]/25 px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-[#2B1C1E]"
                  >
                    <Package className="w-3.5 h-3.5 text-[#9A6058]" />
                    <span>View My Orders ({ordersCount})</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.key}
                  className="flex space-x-4 border-b border-[#2B1C1E]/10 pb-5 items-start"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImgError}
                    className="w-20 h-24 object-cover border border-[#2B1C1E]/10 bg-[#F0DFDD] flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono-spec text-[9px] text-[#9A6058] block">
                          {item.sku}
                        </span>
                        <h4 className="font-serif text-sm mb-0.5 truncate">{item.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#2B1C1E]/40 hover:text-[#9A6058] p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#2B1C1E]/60 mb-2.5">
                      {item.metal} · {item.size}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#2B1C1E]/20 bg-[#FDF8F7]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#2B1C1E]/70 hover:text-[#2B1C1E]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="ao-num px-2.5 text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#2B1C1E]/70 hover:text-[#2B1C1E]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="ao-num text-xs font-medium tracking-wider">
                        {formatPrice(item.unitPriceInr * item.quantity, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onMoveToWishlist(item)}
                      className="mt-2 inline-flex items-center space-x-1 text-[9px] uppercase tracking-[0.18em] text-[#2B1C1E]/55 hover:text-[#9A6058]"
                    >
                      <Heart className="w-2.5 h-2.5" />
                      <span>Save for later</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Gift Presentation Box Option */}
              <label className="flex items-center space-x-2.5 border border-[#2B1C1E]/12 bg-[#F3E4E2]/70 px-3.5 py-2.5 text-[11px] text-[#2B1C1E]/85 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => onSetGiftWrap(e.target.checked)}
                  className="accent-[#2B1C1E]"
                />
                <Gift className="w-3.5 h-3.5 text-[#9A6058] flex-shrink-0" />
                <span>Complimentary Rose-Gold Gift Box &amp; Ribbon</span>
              </label>

              {/* Client Privilege Code */}
              <div className="space-y-1.5">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={clientCode}
                    onChange={(e) => onSetClientCode(e.target.value)}
                    placeholder="Promo code (ATELIER10 / WELCOME5)"
                    className="flex-grow border border-[#2B1C1E]/20 px-3 py-2 text-[11px] bg-[#FDF8F7] focus:outline-none focus:border-[#2B1C1E]"
                  />
                  {appliedDiscountPct > 0 ? (
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="border border-[#2B1C1E]/30 px-3.5 text-[10px] uppercase tracking-[0.18em] hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApplyPromo()}
                      className="border border-[#2B1C1E]/30 px-4 text-[10px] uppercase tracking-[0.2em] hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedDiscountPct === 0 && (
                  <p className="text-[10px] text-[#2B1C1E]/55">
                    Privilege codes:{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onSetClientCode('ATELIER10');
                        onApplyPromo('ATELIER10');
                      }}
                      className="font-mono-spec underline text-[#9A6058]"
                    >
                      ATELIER10
                    </button>{' '}
                    (10% off) ·{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onSetClientCode('WELCOME5');
                        onApplyPromo('WELCOME5');
                      }}
                      className="font-mono-spec underline text-[#9A6058]"
                    >
                      WELCOME5
                    </button>{' '}
                    (5% off)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-[#2B1C1E]/12 pt-5 space-y-3 mt-4">
            <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.18em]">
              <span className="text-[#2B1C1E]/65">Subtotal (Incl. 3% GST)</span>
              <span className="ao-num">{formatPrice(cartSubtotalInr, currency)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.18em]">
              <span className="text-[#2B1C1E]/65">Insured Pan-India Delivery</span>
              <span className="text-[#9A6058] font-medium">FREE</span>
            </div>
            {appliedDiscountPct > 0 && (
              <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.18em] text-[#9A6058]">
                <span>Privilege Courtesy ({appliedDiscountPct}%)</span>
                <span className="ao-num">-{formatPrice(cartDiscountInr, currency)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs uppercase tracking-[0.2em] pt-2 border-t border-[#2B1C1E]/10">
              <span className="font-medium">Total Payable</span>
              <span className="ao-num font-medium text-sm">
                {formatPrice(cartTotalInr, currency)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="ao-num w-full bg-[#2B1C1E] text-[#FAF1F0] py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Proceed to Checkout — {formatPrice(cartTotalInr, currency)}</span>
            </button>

            {ordersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 hover:text-[#9A6058] pt-1"
              >
                Track Existing Orders ({ordersCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
