import { X } from 'lucide-react';
import { CURRENCY_CONFIG } from '../data/catalog';
import { CurrencyCode } from '../types/storefront';

interface MobileNavDrawerProps {
  open: boolean;
  currency: CurrencyCode;
  ordersCount: number;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenOrders: () => void;
  onSetCurrency: (code: CurrencyCode) => void;
}

/** Mobile slide-out navigation & currency drawer. */
export function MobileNavDrawer({
  open,
  currency,
  ordersCount,
  onClose,
  onOpenSearch,
  onOpenOrders,
  onSetCurrency
}: MobileNavDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/60 backdrop-blur-sm flex justify-start"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-4/5 max-w-sm bg-[#FAF1F0] h-full p-8 flex flex-col justify-between border-r border-[#2B1C1E]/15"
      >
        <div>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2.5">
              <img
                src="/shreya-logo-seal.png"
                alt="Shreya & Co. Monogram"
                className="w-9 h-9 object-contain flex-shrink-0"
              />
              <span className="font-serif text-xl tracking-[0.24em]">SHREYA &amp; CO.</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="text-[#2B1C1E]"
            >
              <X className="w-6 h-6 stroke-[1.4]" />
            </button>
          </div>
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col space-y-6 text-xs uppercase tracking-[0.25em]"
          >
            <a href="#collections" onClick={onClose} className="hover:text-[#9A6058]">
              Collections
            </a>
            <a href="#atelier" onClick={onClose} className="hover:text-[#9A6058]">
              The Atelier Stack
            </a>
            <a href="#heritage" onClick={onClose} className="hover:text-[#9A6058]">
              Heritage
            </a>
            <a href="#journal" onClick={onClose} className="hover:text-[#9A6058]">
              Journal
            </a>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="text-left hover:text-[#9A6058]"
            >
              Search Archive
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="text-left hover:text-[#9A6058]"
            >
              My Orders ({ordersCount})
            </button>
          </nav>

          <div className="mt-10 pt-6 border-t border-[#2B1C1E]/10">
            <span className="block text-[9px] uppercase tracking-[0.26em] text-[#2B1C1E]/50 mb-3">
              Valuation Currency
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CURRENCY_CONFIG) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSetCurrency(code)}
                  className={`px-3 py-1.5 text-[10px] tracking-[0.18em] border ${
                    currency === code
                      ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                      : 'border-[#2B1C1E]/20 text-[#2B1C1E]/75'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[10px] tracking-[0.25em] uppercase text-[#2B1C1E]/50">
          © 2026 Shreya &amp; Co. · Pan-India Atelier
        </div>
      </div>
    </div>
  );
}

