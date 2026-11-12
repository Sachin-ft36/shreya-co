import { X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { CurrencyCode, JournalArticle, Product } from '../types/storefront';
import { formatPrice, handleImgError } from '../utils/pricing';

interface JournalModalProps {
  article: JournalArticle | null;
  currency: CurrencyCode;
  onClose: () => void;
  onInspectProduct: (product: Product) => void;
}

/** Editorial journal monograph reader slide-over drawer. */
export function JournalModal({
  article,
  currency,
  onClose,
  onInspectProduct
}: JournalModalProps) {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF1F0] h-full overflow-y-auto p-8 md:p-12 border-l border-[#2B1C1E]/15 ao-panel-enter"
      >
        <div className="flex justify-between items-center pb-5 border-b border-[#2B1C1E]/12 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A6058]">
            Monograph · {article.atelier}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close monograph"
            className="text-[#2B1C1E] hover:text-[#9A6058]"
          >
            <X className="w-5 h-5 stroke-[1.4]" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/55 mb-3">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-3">
              {article.title}
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-[#2B1C1E]/65">
              By {article.author}
            </p>
          </div>

          <div className="aspect-[16/9] bg-[#ECD8D6] border border-[#2B1C1E]/12 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              onError={handleImgError}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-sm text-[#2B1C1E]/85 font-light leading-[1.85]">
            {article.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="border-l-2 border-[#BC8379] bg-[#F3E4E2] p-5 text-xs text-[#2B1C1E]/80 font-light leading-relaxed">
            <span className="block text-[9px] uppercase tracking-[0.26em] text-[#9A6058] mb-1">
              Workshop Specification Note
            </span>
            {article.technicalNote}
          </div>

          <div className="pt-6 border-t border-[#2B1C1E]/12">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[#2B1C1E]/55 mb-4">
              Referenced in This Monograph
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.referencedProductIds.map((pid) => {
                const p = PRODUCTS.find((item) => item.id === pid);
                if (!p) return null;
                return (
                  <div
                    key={p.id}
                    className="flex items-center space-x-3.5 border border-[#2B1C1E]/15 p-3 bg-[#F3E4E2]/50"
                  >
                    <img
                      src={p.image1}
                      alt={p.name}
                      onError={handleImgError}
                      className="w-16 h-20 object-cover border border-[#2B1C1E]/10"
                    />
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-serif text-sm truncate">{p.name}</h4>
                      <span className="ao-num text-xs text-[#2B1C1E]/70 block mb-2">
                        {formatPrice(p.basePriceInr, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onInspectProduct(p);
                        }}
                        className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-[#9A6058]"
                      >
                        Inspect Piece
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

