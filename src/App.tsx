import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { AtelierLoader } from './components/AtelierLoader';
import { AtelierModal } from './components/AtelierModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CollectionsGrid } from './components/CollectionsGrid';
import { Footer } from './components/Footer';
import { HallmarkGlyph } from './components/HallmarkGlyph';
import { Header } from './components/Header';
import { HeritageSection } from './components/HeritageSection';
import { HeroSection } from './components/HeroSection';
import { JournalModal } from './components/JournalModal';
import { JournalSection } from './components/JournalSection';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { OrdersModal } from './components/OrdersModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { StackAtelier } from './components/StackAtelier';
import { TrustStrip } from './components/TrustStrip';
import { Vault3DShowcase } from './components/Vault3DShowcase';
import { WishlistDrawer } from './components/WishlistDrawer';
import { HERO_SLIDES, JOURNAL_ARTICLES, METAL_OPTIONS, PRODUCTS } from './data/catalog';
import {
  AtelierDossierTab,
  CartItem,
  Category,
  CurrencyCode,
  DeliveryAddress,
  JournalArticle,
  MetalFinish,
  OrderStatusStep,
  PaymentMethod,
  PlacedOrder,
  Product,
  SalonLocation,
  SortOption
} from './types/storefront';
import { resolvePromoDiscount } from './utils/delivery';
import { getAdjustedPriceInr } from './utils/pricing';

const BASE_DOCUMENT_TITLE =
  'SHREYA & CO. — Fine Jewellery, Accessories & Lifestyle | Prayagraj & Mumbai Atelier';

export default function App() {
  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('collections');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Currency State
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Hero Editorial Lookbook State
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // Catalog Filtering, Sorting & Per-Card Metal Selection
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('curated');
  const [cardMetals, setCardMetals] = useState<Record<number, MetalFinish>>({});

  // Interactive Atelier Stack Builder State
  const stackCatalog = useMemo(() => PRODUCTS.filter((p) => p.stackable), []);
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [stackedIds, setStackedIds] = useState<number[]>([201, 204]);
  const [stackMetal, setStackMetal] = useState<MetalFinish>('18k Yellow Gold');
  const [stackViewMode, setStackViewMode] = useState<'editorial' | 'blueprint'>('editorial');

  // Persistent Commerce State (Cart & Wishlist)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sc_cart_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage failure
    }
    return [
      {
        key: '201|18k Yellow Gold|One Size',
        id: 201,
        name: 'Butterfly Bliss Necklace',
        sku: 'SC-NK-201',
        metal: '18k Yellow Gold',
        size: 'One Size',
        unitPriceInr: 2499,
        quantity: 1,
        image: PRODUCTS[0]?.image1 || '/product/Butterfly bliss necklace/1.jpeg'
      }
    ];
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sc_wishlist_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [201, 203];
  });

  // Drawers, Checkout & Orders Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [buyNowItems, setBuyNowItems] = useState<CartItem[] | null>(null);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [appliedDiscountPct, setAppliedDiscountPct] = useState(0);

  const [savedAddress, setSavedAddress] = useState<DeliveryAddress>(() => {
    try {
      const saved = localStorage.getItem('sc_address_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.fullName === 'string') return parsed;
      }
    } catch {
      // ignore
    }
    return {
      fullName: '',
      email: '',
      phone: '',
      street: '',
      landmark: '',
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      addressType: 'Home'
    };
  });

  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sc_orders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick View / Product Dossier State
  const [quickViewItem, setQuickViewItem] = useState<Product | null>(null);
  const [qvMetal, setQvMetal] = useState<MetalFinish>('18k Yellow Gold');
  const [qvSize, setQvSize] = useState<string>('');
  const [qvImageIdx, setQvImageIdx] = useState<0 | 1>(0);
  const [qvTab, setQvTab] = useState<'specs' | 'provenance'>('specs');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Editorial Journal Reader & Atelier Modals
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [atelierModal, setAtelierModal] = useState<AtelierDossierTab>(null);
  const [appointmentSalon, setAppointmentSalon] =
    useState<SalonLocation>('Mumbai · Kala Ghoda');
  const [appointmentDate, setAppointmentDate] = useState('2026-11-24');
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  // Newsletter Dispatch
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [dispatchSubscribed, setDispatchSubscribed] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Persist Cart, Wishlist, Orders & Address safely
  useEffect(() => {
    try {
      localStorage.setItem('sc_cart_v3', JSON.stringify(cartItems));
    } catch {
      // noop
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sc_wishlist_v3', JSON.stringify(wishlist));
    } catch {
      // noop
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sc_orders_v1', JSON.stringify(orders));
    } catch {
      // noop
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('sc_address_v1', JSON.stringify(savedAddress));
    } catch {
      // noop
    }
  }, [savedAddress]);

  // Dynamic SEO Document Title sync when viewing a piece or monograph
  useEffect(() => {
    if (quickViewItem) {
      document.title = `${quickViewItem.name} (${quickViewItem.sku}) | SHREYA & CO.`;
    } else if (activeArticle) {
      document.title = `${activeArticle.title} | SHREYA & CO. Journal`;
    } else {
      document.title = BASE_DOCUMENT_TITLE;
    }
  }, [quickViewItem, activeArticle]);

  // Scroll tracking & active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 36);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0);

      const sectionIds = ['collections', 'atelier', 'heritage', 'journal'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 240 && rect.bottom >= 160) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gentle Hero Lookbook Auto-Rotation (pauses on hover/interaction)
  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  // Keyboard shortcuts (Escape closes overlays, Cmd/Ctrl+K opens Search)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCartOpen(false);
        setCheckoutOpen(false);
        setOrdersOpen(false);
        setWishlistOpen(false);
        setSearchOpen(false);
        setQuickViewItem(null);
        setActiveArticle(null);
        setAtelierModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock body scroll when any overlay/drawer is open
  useEffect(() => {
    const hasOverlay =
      mobileMenuOpen ||
      cartOpen ||
      checkoutOpen ||
      ordersOpen ||
      wishlistOpen ||
      searchOpen ||
      Boolean(quickViewItem) ||
      Boolean(activeArticle) ||
      Boolean(atelierModal);
    document.body.style.overflow = hasOverlay ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [
    mobileMenuOpen,
    cartOpen,
    checkoutOpen,
    ordersOpen,
    wishlistOpen,
    searchOpen,
    quickViewItem,
    activeArticle,
    atelierModal
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const openQuickView = (product: Product, preferredMetal?: MetalFinish) => {
    setQuickViewItem(product);
    setQvMetal(preferredMetal || cardMetals[product.id] || '18k Yellow Gold');
    setQvSize(product.sizes[0]);
    setQvImageIdx(0);
    setQvTab('specs');
    setShowSizeGuide(false);
  };

  const addToCart = (
    product: Product,
    metal: MetalFinish = cardMetals[product.id] || '18k Yellow Gold',
    size: string = product.sizes[0],
    quantity = 1
  ) => {
    const unitPriceInr = getAdjustedPriceInr(product.basePriceInr, metal);
    const key = `${product.id}|${metal}|${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          sku: product.sku,
          metal,
          size,
          unitPriceInr,
          quantity,
          image: product.image1
        }
      ];
    });
    triggerToast(`Added ${product.name} (${metal}) to bag`);
  };

  const handleBuyNow = (
    product: Product,
    metal: MetalFinish = cardMetals[product.id] || '18k Yellow Gold',
    size: string = product.sizes[0],
    quantity = 1
  ) => {
    const unitPriceInr = getAdjustedPriceInr(product.basePriceInr, metal);
    const key = `${product.id}|${metal}|${size}`;
    setBuyNowItems([
      {
        key,
        id: product.id,
        name: product.name,
        sku: product.sku,
        metal,
        size,
        unitPriceInr,
        quantity,
        image: product.image1
      }
    ]);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const updateCartQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
    triggerToast('Removed piece from shopping bag');
  };

  const moveCartItemToWishlist = (item: CartItem) => {
    setWishlist((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    setCartItems((prev) => prev.filter((x) => x.key !== item.key));
    triggerToast(`Moved ${item.name} to saved pieces`);
  };

  const toggleWishlist = (id: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    setWishlist((prev) => {
      const exists = prev.includes(id);
      triggerToast(
        exists
          ? `Removed ${product?.name || 'piece'} from saved pieces`
          : `Saved ${product?.name || 'piece'} to saved pieces`
      );
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const toggleStackInclusion = (id: number) => {
    setStackedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          triggerToast('Retain at least one piece in your atelier composition');
          return prev;
        }
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const addFullStackToBag = () => {
    const selectedPieces = stackCatalog.filter((p) => stackedIds.includes(p.id));
    selectedPieces.forEach((p) => {
      const defaultSize = p.sizes.includes('IN 12') ? 'IN 12' : p.sizes[0];
      const unitPriceInr = getAdjustedPriceInr(p.basePriceInr, stackMetal);
      const key = `${p.id}|${stackMetal}|${defaultSize}`;
      setCartItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            key,
            id: p.id,
            name: p.name,
            sku: p.sku,
            metal: stackMetal,
            size: defaultSize,
            unitPriceInr,
            quantity: 1,
            image: p.image1
          }
        ];
      });
    });
    setCartOpen(true);
    triggerToast(`Added ${selectedPieces.length}-piece ${stackMetal} stack to bag`);
  };

  const jumpToCollectionCategory = (cat: Category) => {
    setSelectedCategory(cat);
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Derived Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const base =
      selectedCategory === 'All'
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === selectedCategory);
    if (sortBy === 'price-asc') {
      base.sort((a, b) => a.basePriceInr - b.basePriceInr);
    } else if (sortBy === 'price-desc') {
      base.sort((a, b) => b.basePriceInr - a.basePriceInr);
    }
    return base;
  }, [selectedCategory, sortBy]);

  // Derived Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { products: PRODUCTS.slice(0, 4), articles: [] as JournalArticle[] };
    return {
      products: PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.caratInfo.toLowerCase().includes(q)
      ),
      articles: JOURNAL_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      )
    };
  }, [searchQuery]);

  // Derived Cart & Checkout Totals
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalInr = cartItems.reduce((acc, item) => acc + item.unitPriceInr * item.quantity, 0);
  const cartDiscountInr = Math.round((cartSubtotalInr * appliedDiscountPct) / 100);
  const cartTotalInr = Math.max(0, cartSubtotalInr - cartDiscountInr);

  const activeCheckoutItems = buyNowItems ?? cartItems;
  const checkoutSubtotalInr = activeCheckoutItems.reduce(
    (acc, item) => acc + item.unitPriceInr * item.quantity,
    0
  );
  const checkoutDiscountInr = Math.round((checkoutSubtotalInr * appliedDiscountPct) / 100);
  const checkoutTotalInr = Math.max(0, checkoutSubtotalInr - checkoutDiscountInr);

  // Derived Stack Summary
  const activeStackPiece = stackCatalog[activeStackIndex] || stackCatalog[0];
  const activeStackMetalMeta = METAL_OPTIONS.find((m) => m.name === stackMetal) || METAL_OPTIONS[0];
  const selectedStackPieces = stackCatalog.filter((p) => stackedIds.includes(p.id));
  const stackTotalInr = selectedStackPieces.reduce(
    (sum, p) => sum + getAdjustedPriceInr(p.basePriceInr, stackMetal),
    0
  );
  const stackTotalGrams = selectedStackPieces.reduce((sum, p) => sum + p.weightGrams, 0);

  // Hero Active Slide
  const currentHeroSlide = HERO_SLIDES[heroSlideIdx];
  const currentHeroProduct =
    PRODUCTS.find((p) => p.id === currentHeroSlide.productId) || PRODUCTS[0];

  const applyPromoCode = (overrideCode?: string) => {
    const raw = overrideCode !== undefined ? overrideCode : clientCode;
    if (!raw.trim()) {
      setAppliedDiscountPct(0);
      return;
    }
    const result = resolvePromoDiscount(raw);
    if (result.valid) {
      setAppliedDiscountPct(result.pct);
      triggerToast(`Privilege code ${result.normalized} applied (${result.pct}% off)`);
    } else {
      triggerToast('Code unrecognized — try ATELIER10 or WELCOME5');
    }
  };

  const handlePlaceOrder = ({
    address,
    paymentMethod,
    paymentSummary,
    estimatedDelivery
  }: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    paymentSummary: string;
    estimatedDelivery: string;
  }): PlacedOrder => {
    const orderId = `SC-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const newOrder: PlacedOrder = {
      orderId,
      placedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      statusStep: 0,
      estimatedDelivery,
      items: activeCheckoutItems.map((item) => ({ ...item })),
      subtotalInr: checkoutSubtotalInr,
      discountInr: checkoutDiscountInr,
      shippingInr: 0,
      totalInr: checkoutTotalInr,
      promoCode: appliedDiscountPct > 0 ? clientCode.trim().toUpperCase() : undefined,
      paymentMethod,
      paymentSummary,
      address,
      giftWrap,
      giftNote
    };

    setSavedAddress(address);
    setOrders((prev) => [newOrder, ...prev]);

    // Clear bag only when checking out from bag (preserve bag during direct Buy Now)
    if (!buyNowItems) {
      setCartItems([]);
      setAppliedDiscountPct(0);
      setClientCode('');
    }
    triggerToast(`Order ${orderId} placed successfully`);
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId && !order.cancelled && order.statusStep < 3
          ? { ...order, statusStep: (order.statusStep + 1) as OrderStatusStep }
          : order
      )
    );
    triggerToast(`Updated live tracking for ${orderId}`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.orderId === orderId ? { ...order, cancelled: true } : order))
    );
    triggerToast(`Cancelled order ${orderId}`);
  };

  const reorderPieces = (order: PlacedOrder) => {
    order.items.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (product) {
        addToCart(product, item.metal, item.size, item.quantity);
      }
    });
    setOrdersOpen(false);
    setCartOpen(true);
  };

  return (
    <div className="ao-root min-h-screen bg-[#FAF1F0] text-[#2B1C1E] selection:bg-[#D9A79C]/20 selection:text-[#2B1C1E] antialiased">
      {/* Quiet Editorial Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 right-8 z-50 bg-[#2B1C1E] text-[#FAF1F0] px-5 py-4 border border-[#BC8379]/50 flex items-center space-x-3 shadow-[0_14px_34px_-12px_rgba(43,28,30,0.42)] ao-panel-enter max-w-md"
        >
          <HallmarkGlyph className="w-3.5 h-3.5 text-[#D9A79C] flex-shrink-0" />
          <span className="text-[11px] uppercase tracking-[0.16em] font-normal leading-snug">
            {toastMessage}
          </span>
          {toastMessage.toLowerCase().includes('to bag') && (
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setCartOpen(true);
              }}
              className="text-[10px] uppercase tracking-[0.18em] text-[#D9A79C] underline underline-offset-4 hover:text-[#FAF1F0] flex-shrink-0 pl-1"
            >
              View Bag
            </button>
          )}
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-[#FAF1F0]/50 hover:text-[#FAF1F0] pl-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <AtelierLoader />

      <Header
        isScrolled={isScrolled}
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        currency={currency}
        wishlistCount={wishlist.length}
        totalCartCount={totalCartCount}
        ordersCount={orders.filter((o) => !o.cancelled).length}
        onSetCurrency={setCurrency}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSection
          heroSlideIdx={heroSlideIdx}
          currentHeroProduct={currentHeroProduct}
          currency={currency}
          onSelectSlide={setHeroSlideIdx}
          onPauseChange={setHeroPaused}
          onOpenQuickView={openQuickView}
          onAddToCart={addToCart}
        />

        <TrustStrip onOpenModal={setAtelierModal} />

        <CollectionsGrid
          filteredProducts={filteredProducts}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          currency={currency}
          wishlist={wishlist}
          cartItems={cartItems}
          cardMetals={cardMetals}
          onSelectCategory={setSelectedCategory}
          onSelectSort={setSortBy}
          onSelectCardMetal={(id, metal) => setCardMetals((prev) => ({ ...prev, [id]: metal }))}
          onToggleWishlist={toggleWishlist}
          onOpenQuickView={openQuickView}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          onUpdateCartQty={updateCartQty}
          onOpenCart={() => setCartOpen(true)}
        />

        <Vault3DShowcase
          currency={currency}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          onOpenQuickView={openQuickView}
        />

        <StackAtelier
          stackCatalog={stackCatalog}
          activeStackIndex={activeStackIndex}
          activeStackPiece={activeStackPiece}
          activeStackMetalMeta={activeStackMetalMeta}
          selectedStackPieces={selectedStackPieces}
          stackedIds={stackedIds}
          stackMetal={stackMetal}
          stackViewMode={stackViewMode}
          stackTotalInr={stackTotalInr}
          stackTotalGrams={stackTotalGrams}
          currency={currency}
          onSelectStackIndex={setActiveStackIndex}
          onToggleInclusion={toggleStackInclusion}
          onSelectStackMetal={setStackMetal}
          onSelectViewMode={setStackViewMode}
          onAddFullStackToBag={addFullStackToBag}
          onAddSingleToBag={addToCart}
          onOpenQuickView={openQuickView}
        />

        <HeritageSection onOpenProvenance={setAtelierModal} />

        <JournalSection onSelectArticle={setActiveArticle} />
      </main>

      <Footer
        currency={currency}
        dispatchEmail={dispatchEmail}
        dispatchSubscribed={dispatchSubscribed}
        onSetCurrency={setCurrency}
        onSetDispatchEmail={setDispatchEmail}
        onSubmitDispatch={(e) => {
          e.preventDefault();
          setDispatchSubscribed(true);
          triggerToast('Subscribed to Private Dispatch');
        }}
        onJumpToCategory={jumpToCollectionCategory}
        onOpenAtelierModal={(tab) => {
          if (tab === 'appointment') setAppointmentSubmitted(false);
          setAtelierModal(tab);
        }}
        onTriggerToast={triggerToast}
      />

      <MobileNavDrawer
        open={mobileMenuOpen}
        currency={currency}
        ordersCount={orders.filter((o) => !o.cancelled).length}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onSetCurrency={setCurrency}
      />

      <SearchModal
        open={searchOpen}
        searchQuery={searchQuery}
        searchResults={searchResults}
        currency={currency}
        onClose={() => setSearchOpen(false)}
        onSearchChange={setSearchQuery}
        onOpenQuickView={(prod) => openQuickView(prod)}
        onAddToCart={(prod) => addToCart(prod)}
        onOpenArticle={setActiveArticle}
      />

      <CartDrawer
        open={cartOpen}
        cartItems={cartItems}
        totalCartCount={totalCartCount}
        cartSubtotalInr={cartSubtotalInr}
        cartDiscountInr={cartDiscountInr}
        cartTotalInr={cartTotalInr}
        appliedDiscountPct={appliedDiscountPct}
        clientCode={clientCode}
        giftWrap={giftWrap}
        ordersCount={orders.length}
        currency={currency}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onMoveToWishlist={moveCartItemToWishlist}
        onClearCart={() => {
          setCartItems([]);
          triggerToast('Cleared shopping bag');
        }}
        onSetClientCode={setClientCode}
        onApplyPromo={applyPromoCode}
        onRemovePromo={() => {
          setClientCode('');
          setAppliedDiscountPct(0);
          triggerToast('Promo code removed');
        }}
        onSetGiftWrap={setGiftWrap}
        onProceedToCheckout={() => {
          setBuyNowItems(null);
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onOpenOrders={() => setOrdersOpen(true)}
        onBrowseCollections={jumpToCollectionCategory}
      />

      <CheckoutModal
        open={checkoutOpen}
        items={activeCheckoutItems}
        currency={currency}
        subtotalInr={checkoutSubtotalInr}
        discountInr={checkoutDiscountInr}
        totalInr={checkoutTotalInr}
        appliedDiscountPct={appliedDiscountPct}
        clientCode={clientCode}
        initialAddress={savedAddress}
        giftWrap={giftWrap}
        giftNote={giftNote}
        onClose={() => {
          setCheckoutOpen(false);
          setBuyNowItems(null);
        }}
        onSetClientCode={setClientCode}
        onApplyPromo={applyPromoCode}
        onSetGiftWrap={setGiftWrap}
        onSetGiftNote={setGiftNote}
        onPlaceOrder={handlePlaceOrder}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <OrdersModal
        open={ordersOpen}
        orders={orders}
        currency={currency}
        onClose={() => setOrdersOpen(false)}
        onAdvanceStatus={advanceOrderStatus}
        onCancelOrder={cancelOrder}
        onReorder={reorderPieces}
      />

      <WishlistDrawer
        open={wishlistOpen}
        wishlist={wishlist}
        cardMetals={cardMetals}
        currency={currency}
        onClose={() => setWishlistOpen(false)}
        onOpenQuickView={openQuickView}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
      />

      <QuickViewModal
        item={quickViewItem}
        qvMetal={qvMetal}
        qvSize={qvSize}
        qvImageIdx={qvImageIdx}
        qvTab={qvTab}
        showSizeGuide={showSizeGuide}
        wishlist={wishlist}
        currency={currency}
        onClose={() => setQuickViewItem(null)}
        onSelectMetal={setQvMetal}
        onSelectSize={setQvSize}
        onSelectImageIdx={setQvImageIdx}
        onSelectTab={setQvTab}
        onToggleSizeGuide={() => setShowSizeGuide((prev) => !prev)}
        onAddToCart={(product, metal, size, qty) => {
          addToCart(product, metal, size, qty);
          setCartOpen(true);
        }}
        onBuyNow={handleBuyNow}
        onToggleWishlist={toggleWishlist}
      />

      <JournalModal
        article={activeArticle}
        currency={currency}
        onClose={() => setActiveArticle(null)}
        onInspectProduct={(p) => openQuickView(p)}
      />

      <AtelierModal
        activeTab={atelierModal}
        appointmentSalon={appointmentSalon}
        appointmentDate={appointmentDate}
        appointmentSubmitted={appointmentSubmitted}
        onClose={() => setAtelierModal(null)}
        onSelectTab={setAtelierModal}
        onSelectSalon={setAppointmentSalon}
        onSetDate={setAppointmentDate}
        onResetSubmitted={() => setAppointmentSubmitted(false)}
        onSubmitAppointment={(e) => {
          e.preventDefault();
          setAppointmentSubmitted(true);
          triggerToast(`Private viewing requested for ${appointmentSalon}`);
        }}
      />
    </div>
  );
}

