import { ArrowUpRight, Instagram } from 'lucide-react';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  JOURNAL_ARTICLES,
  PRODUCTS
} from '../data/catalog';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { JournalArticle } from '../types/storefront';
import { handleImgError } from '../utils/pricing';

interface JournalSectionProps {
  onSelectArticle: (article: JournalArticle) => void;
}

/** Editorial 2-column craftsmanship journal cards opening full monographs. */
export function JournalSection({ onSelectArticle }: JournalSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.12);

  return (
    <section
      id="journal"
      ref={ref}
      data-visible={visible}
      aria-labelledby="journal-heading"
      className="py-24 border-t border-[#2B1C1E]/10 px-6 md:px-12 max-w-7xl mx-auto ao-reveal"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-14 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9A6058] block mb-3">
            Editorial Journal
          </span>
          <h2 id="journal-heading" className="font-serif text-3xl md:text-4xl font-light">
            Notes on Craftsmanship
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#2B1C1E]/55">
          Dispatches from Prayagraj &amp; Mumbai
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {JOURNAL_ARTICLES.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/10] bg-[#ECD8D6] border border-[#2B1C1E]/15 overflow-hidden mb-6 transition-shadow duration-500 group-hover:shadow-[0_20px_40px_-18px_rgba(43,28,30,0.22)]">
              <img
                src={article.image}
                alt={`${article.title} — ${article.atelier}`}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-full object-cover ao-ease-image group-hover:scale-105"
              />
            </div>
            <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.25em] text-[#9A6058] mb-2">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
            <h3 className="font-serif text-2xl font-normal mb-2.5 group-hover:text-[#9A6058] transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-[#2B1C1E]/75 font-light leading-relaxed max-w-md mb-4">
              {article.excerpt}
            </p>
            <span className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.22em] font-medium border-b border-[#2B1C1E]/25 pb-0.5 group-hover:border-[#BC8379]">
              <span>Read Monograph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </article>
        ))}
      </div>
      {/* Homepage Instagram Lookbook Strip */}
      <div className="mt-20 pt-14 border-t border-[#2B1C1E]/10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#9A6058] mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>On Instagram · {INSTAGRAM_HANDLE}</span>
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#2B1C1E]">
              Live From the Atelier Feed
            </h3>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#2B1C1E]/30 px-6 py-3 text-[10px] uppercase tracking-[0.22em] font-medium text-[#2B1C1E] hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors self-start sm:self-auto"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Follow {INSTAGRAM_HANDLE}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 4).map((piece) => (
            <a
              key={piece.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${piece.name} on Instagram ${INSTAGRAM_HANDLE}`}
              className="group relative aspect-square bg-[#ECD8D6] border border-[#2B1C1E]/12 overflow-hidden"
            >
              <img
                src={piece.image1}
                alt={`${piece.name} — ${INSTAGRAM_HANDLE}`}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-full object-cover ao-ease-image group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#2B1C1E]/0 group-hover:bg-[#2B1C1E]/35 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#FAF1F0]">
                  {INSTAGRAM_HANDLE}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FAF1F0]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
