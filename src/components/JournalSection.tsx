import { useEffect, useState } from 'react';
import { ArrowUpRight, Film, Heart, Instagram } from 'lucide-react';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  JOURNAL_ARTICLES
} from '../data/catalog';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { JournalArticle } from '../types/storefront';
import { handleImgError } from '../utils/pricing';

export const BEHOLD_FEED_URL = 'https://feeds.behold.so/xTNiEj5QhDcakqnsaY8Z';

interface InstagramPostItem {
  id: string;
  mediaUrl: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption: string;
  likes?: number;
}

const DEFAULT_FEED_POSTS: InstagramPostItem[] = [
  {
    id: 'post-1',
    mediaUrl: '/product/Ocean vibes necklace/1.jpeg',
    permalink: 'https://www.instagram.com/shreyaco.1/',
    mediaType: 'IMAGE',
    caption: 'Ocean Vibes Handcrafted Pendant'
  },
  {
    id: 'post-2',
    mediaUrl: '/product/Scarf Pearl Necklace/1.jpeg',
    permalink: 'https://www.instagram.com/shreyaco.1/reels/',
    mediaType: 'VIDEO',
    caption: 'Scarf Pearl Necklace Drape Styling Reel'
  },
  {
    id: 'post-3',
    mediaUrl: '/product/Butterfly bliss necklace/1.jpeg',
    permalink: 'https://www.instagram.com/shreyaco.1/',
    mediaType: 'IMAGE',
    caption: 'Butterfly Bliss Fine Silver Chain'
  },
  {
    id: 'post-4',
    mediaUrl: '/product/Mouse charm necklace/1.jpeg',
    permalink: 'https://www.instagram.com/shreyaco.1/reels/',
    mediaType: 'VIDEO',
    caption: 'Artisan Finishing Reel from Prayagraj'
  }
];

interface JournalSectionProps {
  onSelectArticle: (article: JournalArticle) => void;
}

/** Editorial 2-column craftsmanship journal cards opening full monographs. */
export function JournalSection({ onSelectArticle }: JournalSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.12);
  const [feedPosts, setFeedPosts] = useState<InstagramPostItem[]>(DEFAULT_FEED_POSTS);

  // Automatically fetch live 4 recent posts/reels from Behold Instagram Feed
  useEffect(() => {
    const feedUrl =
      ((import.meta as any).env?.VITE_INSTAGRAM_FEED_URL as string | undefined)?.trim() ||
      BEHOLD_FEED_URL;

    fetch(feedUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Feed response error');
        return res.json();
      })
      .then((data) => {
        const rawItems = Array.isArray(data) ? data : data.posts || data.data || data.items || [];
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const formatted: InstagramPostItem[] = rawItems.slice(0, 4).map((p: any, i: number) => {
            const img =
              p.sizes?.large?.mediaUrl ||
              p.sizes?.medium?.mediaUrl ||
              p.mediaUrl ||
              p.thumbnailUrl ||
              '';
            const isVideo = (p.mediaType || p.media_type || '').toUpperCase() === 'VIDEO';
            return {
              id: p.id || `feed-${i}`,
              mediaUrl: img,
              permalink: p.permalink || p.link || INSTAGRAM_URL,
              mediaType: isVideo ? 'VIDEO' : 'IMAGE',
              caption: p.prunedCaption || p.caption || 'Live from @shreyaco.1',
              likes: p.likeCount
            };
          });
          if (formatted.length > 0) {
            setFeedPosts(formatted);
          }
        }
      })
      .catch(() => {
        // Quiet fallback to default posts
      });
  }, []);

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
          {feedPosts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${post.caption} on Instagram ${INSTAGRAM_HANDLE}`}
              className="group relative aspect-square bg-[#ECD8D6] border border-[#2B1C1E]/12 overflow-hidden shadow-sm"
            >
              {/* Reel indicator badge */}
              {post.mediaType === 'VIDEO' && (
                <div className="absolute top-2.5 right-2.5 z-10 bg-[#2B1C1E]/80 backdrop-blur-sm text-[#FAF1F0] px-2 py-0.5 text-[8px] uppercase tracking-[0.16em] flex items-center gap-1 rounded pointer-events-none">
                  <Film className="w-2.5 h-2.5 text-[#D9A79C]" />
                  <span>Reel</span>
                </div>
              )}

              <img
                src={post.mediaUrl}
                alt={post.caption}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-full object-cover ao-ease-image group-hover:scale-105"
              />

              {/* Hover overlay with direct Instagram link */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1C1E]/85 via-[#2B1C1E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5">
                <p className="text-[10px] text-[#FAF1F0] line-clamp-2 font-light leading-snug mb-1.5">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-[#D9A79C] font-medium">
                  <span className="flex items-center gap-1">
                    <Instagram className="w-3 h-3" />
                    <span>{post.mediaType === 'VIDEO' ? 'Watch Reel' : 'View Post'}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {typeof post.likes === 'number' && post.likes > 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-[#FAF1F0]/85 lowercase">
                        <Heart className="w-2.5 h-2.5 fill-current text-[#BC8379]" />
                        <span>{post.likes}</span>
                      </span>
                    )}
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#FAF1F0]" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
