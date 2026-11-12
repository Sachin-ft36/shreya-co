export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type MetalFinish = '18k Yellow Gold' | '18k Rose Gold' | '950 Platinum';
export type Category = 'All' | 'Rings' | 'Earrings' | 'Bracelets' | 'Necklaces';
export type SortOption = 'curated' | 'price-asc' | 'price-desc';
export type AtelierDossierTab = 'provenance' | 'sizing' | 'appointment' | 'assurance' | null;
export type SalonLocation = 'Mumbai · Kala Ghoda' | 'New Delhi · Mehrauli' | 'Private Video Viewing';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type AddressType = 'Home' | 'Office' | 'Salon Pickup';
export type OrderStatusStep = 0 | 1 | 2 | 3;

export interface DeliveryAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  addressType: AddressType;
}

export interface PlacedOrder {
  orderId: string;
  placedAt: string;
  statusStep: OrderStatusStep;
  cancelled?: boolean;
  estimatedDelivery: string;
  items: CartItem[];
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  totalInr: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  paymentSummary: string;
  address: DeliveryAddress;
  giftWrap: boolean;
  giftNote: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<Category, 'All'>;
  basePriceInr: number;
  weightGrams: number;
  caratInfo: string;
  dimensions: string;
  hallmark: string;
  leadTime: string;
  description: string;
  image1: string;
  image2: string;
  sizes: string[];
  sizeLabel: string;
  stackable?: boolean;
  stackRole?: string;
  stackWidthMm?: number;
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  sku: string;
  metal: MetalFinish;
  size: string;
  unitPriceInr: number;
  quantity: number;
  image: string;
}

export interface HeroSlide {
  id: string;
  plateNumber: string;
  productId: number;
  eyebrow: string;
  title: string;
  specLine: string;
  image: string;
  alt: string;
}

export interface JournalArticle {
  id: string;
  date: string;
  readTime: string;
  author: string;
  atelier: string;
  title: string;
  excerpt: string;
  image: string;
  paragraphs: string[];
  technicalNote: string;
  referencedProductIds: number[];
}

export interface MetalOption {
  name: MetalFinish;
  short: string;
  swatch: string;
  multiplier: number;
  grade: string;
  filterCss: string;
}

