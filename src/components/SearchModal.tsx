import { ArrowUpRight, X } from 'lucide-react';
import { CurrencyCode, JournalArticle, Product } from '../types/storefront';
import { formatPrice, handleImgError } from '../utils/pricing';

interface SearchModalProps {
  open: boolean;
  searchQuery: string;
  searchResults: {
    products: Product[];
    articles: JournalArticle[];
  };
  currency: CurrencyCode;
  onClose: () => void;
  onSearchChange: (q: string) => void;
  onOpenQuickView: (prod: Product) => void;
  onAddToCart: (prod: Product) => void;
  onOpenArticle: (article: JournalArticle) => void;
}

/** Live catalogue & monograph search overlay (⌘K / Ctrl+K). */
export function SearchModal({
  open,
  searchQuery,
  searchResults,
  currency,
  onClose,
  onSearchChange,
  onOpenQuickView,
  onAddToCart,
  onOpenArticle
}: SearchModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FAF1F0]/96 backdrop-blur-md overflow-y-auto px-6 pt-16 pb-16"
      onClick={onClose}
    >
      <div className="max-w-4xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-10 border-b border-[#2B1C1E]/15 pb-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#9A6058]">
            Atelier Archive Search
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Search"
            className="text-[#2B1C1E] p-2 hover:text-[#9A6058]"
          >
            <X className="w-6 h-6 stroke-[1.4]" />
          </button>
        </div>

        <div className="relative mb-6">
          <label htmlFor="archive-search-input" className="sr-only">
            Search jewellery and monographs
          </label>
          <input
            id="archive-search-input"
            type="text"
            autoFocus
            placeholder="Search solitaire, cuff, signet, BIS 750..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border-b border-[#2B1C1E] py-4 text-2xl md:text-4xl font-serif placeholder:text-[#2B1C1E]/30 focus:outline-none focus:border-[#BC8379]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#2B1C1E]/45 mr-2">
            Quick Index:
          </span>
          {['Diamond', '18k', 'Cuff', 'Signet', 'Chain', 'Earrings'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSearchChange(term)}
              className="border border-[#2B1C1E]/20 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] hover:border-[#2B1C1E] transition-colors"
            >
              {term}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-[10px] uppercase tracking-[0.2em] text-[#9A6058] underline underline-offset-4 ml-2"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#2B1C1E]/55 mb-5">
              {searchQuery.trim()
                ? `Matching Pieces (${searchResults.products.length})`
                : 'Featured Objects'}
            </h3>

            {searchResults.products.length === 0 ? (
              <p className="text-sm text-[#2B1C1E]/65 font-light py-6 border-y border-[#2B1C1E]/10">
                No archive pieces match “{searchQuery}”. Try searching by category (Rings, Bracelets) or SKU.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {searchResults.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex space-x-4 border border-[#2B1C1E]/12 bg-[#F3E4E2]/55 p-3.5 items-center"
                  >
                    <img
                      src={prod.image1}
                      alt={prod.name}
                      onError={handleImgError}
                      className="w-20 h-24 object-cover border border-[#2B1C1E]/10 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <span className="font-mono-spec text-[9px] text-[#9A6058] block">
                        {prod.sku} · {prod.category}
                      </span>
                      <h4 className="font-serif text-base truncate">{prod.name}</h4>
                      <span className="ao-num text-xs text-[#2B1C1E]/75 block mb-2.5">
                        {formatPrice(prod.basePriceInr, currency)}
                      </span>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenQuickView(prod);
                          }}
                          className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-[#9A6058]"
                        >
                          Dossier
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToCart(prod)}
                          className="text-[10px] uppercase tracking-[0.2em] bg-[#2B1C1E] text-[#FAF1F0] px-3 py-1 hover:bg-[#9A6058] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {searchResults.articles.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#2B1C1E]/55 mb-4">
                Journal Monographs ({searchResults.articles.length})
              </h3>
              <div className="space-y-3">
                {searchResults.articles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenArticle(art);
                    }}
                    className="w-full text-left border border-[#2B1C1E]/15 p-4 hover:border-[#2B1C1E] transition-colors flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#9A6058]">
                        {art.date} · {art.atelier}
                      </span>
                      <h4 className="font-serif text-lg">{art.title}</h4>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#2B1C1E]/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

