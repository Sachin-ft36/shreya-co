import { Heart, Menu, Package, Search, ShoppingBag } from 'lucide-react';
import { CURRENCY_CONFIG } from '../data/catalog';
import { CurrencyCode } from '../types/storefront';

interface HeaderProps {
  isScrolled: boolean;
  scrollProgress: number;
  activeSection: string;
  currency: CurrencyCode;
  wishlistCount: number;
  totalCartCount: number;
  ordersCount: number;
  onSetCurrency: (code: CurrencyCode) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenCart: () => void;
}

/** Sticky frosted-glass editorial navigation header with monogram seal and live utility counters. */
export function Header({
  isScrolled,
  scrollProgress,
  activeSection,
  currency,
  wishlistCount,
  totalCartCount,
  ordersCount,
  onSetCurrency,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenWishlist,
  onOpenOrders,
  onOpenCart
}: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF1F0]/92 backdrop-blur-md py-3 border-b border-[#2B1C1E]/10'
          : 'bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left Navigation Column */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden text-[#2B1C1E] focus:outline-none p-1"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5 stroke-[1.4]" />
          </button>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[10px] xl:text-[11px] uppercase tracking-[0.2em] font-medium text-[#2B1C1E]/80 whitespace-nowrap"
          >
            <a
              href="#collections"
              data-active={activeSection === 'collections'}
              className="ao-hairline-link hover:text-[#2B1C1E] transition-colors"
            >
              Collections
            </a>
            <a
              href="#heritage"
              data-active={activeSection === 'heritage'}
              className="ao-hairline-link hover:text-[#2B1C1E] transition-colors"
            >
              Heritage
            </a>
            <a
              href="#journal"
              data-active={activeSection === 'journal'}
              className="ao-hairline-link hover:text-[#2B1C1E] transition-colors"
            >
              Journal
            </a>
          </nav>
        </div>

        {/* Center Balanced Brand Wordmark & Seal */}
        <div className="justify-self-center text-center">
          <a href="#" className="inline-flex items-center justify-center gap-2 group whitespace-nowrap">
            <img
              src="/shreya-logo-seal.png"
              alt="Shreya & Co. Monogram"
              className={`object-contain transition-all duration-500 flex-shrink-0 ${
                isScrolled ? 'w-6 h-6 md:w-7 md:h-7' : 'w-7 h-7 md:w-8 md:h-8'
              }`}
            />
            <span
              className={`font-serif tracking-[0.2em] md:tracking-[0.24em] uppercase font-normal transition-all duration-500 whitespace-nowrap ${
                isScrolled ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-[22px]'
              }`}
            >
              SHREYA &amp; CO.
            </span>
          </a>
          <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#9A6058] mt-0.5 whitespace-nowrap">
            Jewellery · Accessories · Lifestyle
          </span>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center justify-end space-x-3.5 sm:space-x-5">
          <div className="hidden xl:flex items-center border-r border-[#2B1C1E]/15 pr-4 space-x-2 text-[10px] tracking-[0.16em] whitespace-nowrap">
            {(Object.keys(CURRENCY_CONFIG) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onSetCurrency(code)}
                className={`transition-colors ${
                  currency === code
                    ? 'text-[#2B1C1E] font-semibold underline underline-offset-4 decoration-[#BC8379]'
                    : 'text-[#2B1C1E]/45 hover:text-[#2B1C1E]'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            title="Search Catalogue (⌘K)"
            className="hidden sm:flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.18em] text-[#2B1C1E]/80 hover:text-[#9A6058] transition-colors p-1 whitespace-nowrap"
            aria-label="Open Catalogue Search"
          >
            <Search className="w-4 h-4 stroke-[1.4]" />
            <span className="hidden 2xl:inline">Search</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            title="Saved Pieces"
            className="relative text-[#2B1C1E]/80 hover:text-[#9A6058] transition-colors p-1"
            aria-label={`Saved Pieces (${wishlistCount})`}
          >
            <Heart className="w-4 h-4 stroke-[1.4]" />
            {wishlistCount > 0 && (
              <span className="ao-num absolute -top-1 -right-1 bg-[#2B1C1E] text-[#FAF1F0] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenOrders}
            title="My Orders & Tracking"
            className="relative flex items-center space-x-1.5 text-[#2B1C1E]/80 hover:text-[#9A6058] transition-colors p-1 whitespace-nowrap"
            aria-label={`My Orders (${ordersCount})`}
          >
            <Package className="w-4 h-4 stroke-[1.4]" />
            <span className="hidden 2xl:inline text-[10px] uppercase tracking-[0.18em]">Orders</span>
            {ordersCount > 0 && (
              <span className="ao-num absolute -top-1 -right-1 bg-[#2B1C1E] text-[#FAF1F0] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                {ordersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            title="Shopping Bag"
            className="relative flex items-center text-xs uppercase tracking-[0.2em] text-[#2B1C1E]/80 hover:text-[#9A6058] transition-colors p-1"
            aria-label={`Shopping Bag (${totalCartCount})`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
            {totalCartCount > 0 && (
              <span className="ao-num absolute -top-1 -right-1 bg-[#BC8379] text-[#FAF1F0] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Reading Progress Hairline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-[#BC8379] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%`, opacity: isScrolled ? 0.85 : 0 }}
        />
      </div>
    </header>
  );
}

