import {
  CurrencyCode,
  HeroSlide,
  JournalArticle,
  MetalOption,
  Product
} from '../types/storefront';

export const INSTAGRAM_HANDLE = '@shreyaco.1';
export const INSTAGRAM_URL =
  'https://www.instagram.com/shreyaco.1?rpxt=M3Q2bDJwdzRocWl2';

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; rate: number; label: string }
> = {
  INR: { symbol: '₹', rate: 1, label: 'INR ₹' },
  USD: { symbol: '$', rate: 0.0118, label: 'USD $' },
  EUR: { symbol: '€', rate: 0.0109, label: 'EUR €' },
  GBP: { symbol: '£', rate: 0.0093, label: 'GBP £' }
};

export const METAL_OPTIONS: MetalOption[] = [
  {
    name: '18k Yellow Gold',
    short: '18k Yellow',
    swatch: '#C9A86A',
    multiplier: 1,
    grade: 'Au 750 · Warm Brushed',
    filterCss: 'none'
  },
  {
    name: '18k Rose Gold',
    short: '18k Rose',
    swatch: '#C89B88',
    multiplier: 1.03,
    grade: 'Au 750 · Rose Alloy',
    filterCss: 'sepia(0.18) saturate(1.12) hue-rotate(-8deg)'
  },
  {
    name: '950 Platinum',
    short: '950 Platinum',
    swatch: '#C8C6C2',
    multiplier: 1.18,
    grade: 'Pt 950 · Cool Mirror',
    filterCss: 'saturate(0.35) brightness(1.03) contrast(1.04)'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 201,
    sku: 'SC-NK-201',
    name: 'Butterfly Bliss Necklace',
    subtitle: 'Delicate Butterfly Charm · Fine Chain',
    category: 'Necklaces',
    basePriceInr: 2499,
    weightGrams: 8.2,
    caratInfo: 'Silver-plated · Butterfly Charm',
    dimensions: '45 cm adjustable chain · 2 cm charm',
    hallmark: 'BIS Silver · Handcrafted',
    leadTime: 'Dispatches Pan-India in 2 days',
    description:
      'A whimsical butterfly charm suspended on a dainty fine chain. Lightweight and versatile — perfect for everyday wear or gifting.',
    image1: '/product/Butterfly bliss necklace/1.jpeg',
    image2: '/product/Butterfly bliss necklace/2.jpeg',
    image3: '/product/Butterfly bliss necklace/3.jpeg',
    image4: '/product/Butterfly bliss necklace/4.jpeg',
    sizes: ['One Size'],
    sizeLabel: 'Chain Length'
  },
  {
    id: 202,
    sku: 'SC-NK-202',
    name: 'Mouse Charm Necklace',
    subtitle: 'Playful Mouse Pendant · Adjustable Chain',
    category: 'Necklaces',
    basePriceInr: 1999,
    weightGrams: 6.5,
    caratInfo: 'Silver-plated · Enamel Accent',
    dimensions: '40 cm adjustable chain · 1.5 cm charm',
    hallmark: 'BIS Silver · Handcrafted',
    leadTime: 'Dispatches Pan-India in 2 days',
    description:
      'An adorable hand-finished mouse charm necklace with subtle enamel detailing. A conversation piece for the playfully stylish.',
    image1: '/product/Mouse charm necklace/1.jpeg',
    image2: '/product/Mouse charm necklace/2.jpeg',
    image3: '/product/Mouse charm necklace/3.jpeg',
    image4: '/product/Mouse charm necklace/4.jpeg',
    sizes: ['One Size'],
    sizeLabel: 'Chain Length'
  },
  {
    id: 203,
    sku: 'SC-NK-203',
    name: 'Ocean Vibes Necklace',
    subtitle: 'Sea-Inspired Pendant · Sterling Chain',
    category: 'Necklaces',
    basePriceInr: 2799,
    weightGrams: 9.1,
    caratInfo: 'Silver-plated · Sea Blue Resin',
    dimensions: '45 cm chain · 2.2 cm pendant',
    hallmark: 'BIS Silver · Artisan Finished',
    leadTime: 'Dispatches Pan-India in 2 days',
    description:
      'Inspired by the calm of the open sea. A coastal pendant in sea-blue resin set within a polished silver border — effortlessly breezy.',
    image1: '/product/Ocean vibes necklace/1.jpeg',
    image2: '/product/Ocean vibes necklace/2.jpeg',
    image3: '/product/Ocean vibes necklace/3.jpeg',
    image4: '/product/Ocean vibes necklace/4.jpeg',
    sizes: ['One Size'],
    sizeLabel: 'Chain Length'
  },
  {
    id: 204,
    sku: 'SC-NK-204',
    name: 'Scarf Pearl Necklace',
    subtitle: 'Freshwater Pearl · Scarf Drape Style',
    category: 'Necklaces',
    basePriceInr: 3499,
    weightGrams: 12.4,
    caratInfo: 'Freshwater Pearls · Gold-plated Clasp',
    dimensions: '70 cm long · Multi-wrap style',
    hallmark: 'Natural Pearl · Certified',
    leadTime: 'Dispatches Pan-India in 3 days',
    description:
      'A generous strand of luminous freshwater pearls designed to drape loosely like a silk scarf. Wear long, doubled, or knotted — endlessly adaptable.',
    image1: '/product/Scarf Pearl Necklace/1.jpeg',
    image2: '/product/Scarf Pearl Necklace/2.jpeg',
    image3: '/product/Scarf Pearl Necklace/3.jpeg',
    image4: '/product/Scarf Pearl Necklace/4.jpeg',
    sizes: ['One Size'],
    sizeLabel: 'Chain Length'
  },
  {
    id: 205,
    sku: 'SC-AC-205',
    name: 'Trendy Scarf',
    subtitle: 'Luxury Printed Silk Scarf · Limited Edition',
    category: 'Necklaces',
    basePriceInr: 1799,
    weightGrams: 45.0,
    caratInfo: 'Premium Satin Fabric',
    dimensions: '60 cm × 60 cm',
    hallmark: 'Handscreen Printed · Prayagraj',
    leadTime: 'Dispatches Pan-India in 2 days',
    description:
      'A silky-smooth printed scarf that doubles as a neck tie, bag accessory, or hair wrap. Part of a limited artisan print edition from our Prayagraj atelier.',
    image1: '/product/Terendy scarf /1.jpeg',
    image2: '/product/Terendy scarf /2.jpeg',
    image3: '/product/Terendy scarf /3.jpeg',
    image4: '/product/Terendy scarf /4.jpeg',
    sizes: ['One Size'],
    sizeLabel: 'Size'
  }
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'plate-01',
    plateNumber: '01',
    productId: 201,
    eyebrow: 'New Arrival',
    title: 'Butterfly Bliss Necklace',
    specLine: 'Delicate butterfly charm suspended on a fine adjustable silver-plated chain.',
    image: '/product/Butterfly bliss necklace/1.jpeg',
    alt: 'Shreya & Co. — Butterfly Bliss Necklace'
  },
  {
    id: 'plate-02',
    plateNumber: '02',
    productId: 203,
    eyebrow: 'New Arrival',
    title: 'Ocean Vibes Necklace',
    specLine: 'Sea-blue resin pendant in a polished silver border — effortlessly breezy.',
    image: '/product/Ocean vibes necklace/1.jpeg',
    alt: 'Shreya & Co. — Ocean Vibes Necklace'
  },
  {
    id: 'plate-03',
    plateNumber: '03',
    productId: 204,
    eyebrow: 'New Arrival',
    title: 'Scarf Pearl Necklace',
    specLine: 'Luminous freshwater pearls in a multi-wrap scarf drape style.',
    image: '/product/Scarf Pearl Necklace/1.jpeg',
    alt: 'Shreya & Co. — Scarf Pearl Necklace'
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'handcrafted-charm-necklaces',
    date: 'November 10, 2026',
    readTime: '3 min read',
    author: 'Priya Sharma, Creative Director',
    atelier: 'Prayagraj Foundry',
    title: 'The Art of the Handcrafted Charm',
    excerpt:
      'How our artisans breathe life into every tiny butterfly and sea-inspired pendant — one hand-finish at a time.',
    image: '/product/Butterfly bliss necklace/2.jpeg',
    paragraphs: [
      'Every charm at Shreya & Co. begins as a hand-drawn sketch on butter paper. Our karigar in Prayagraj trace the outline onto a wax mould, refining curves until the proportions feel alive in the hand.',
      'The butterfly motif, our most requested form, demands twenty-two separate hand-finishing steps — from raw casting to final polish. Wings are bevelled individually so each catches light at a slightly different angle.',
      'We reject any piece where the antennae deviate more than 0.3 mm from the master template. This obsessive tolerance is invisible in photographs but instantly felt when worn.'
    ],
    technicalNote:
      'Silver-plated brass base with anti-tarnish lacquer · Nickel-free · Hallmarked.',
    referencedProductIds: [201, 202]
  },
  {
    id: 'ocean-pearl-collection',
    date: 'November 5, 2026',
    readTime: '4 min read',
    author: 'Meera Iyer, Head of Design',
    atelier: 'Mumbai Studio',
    title: 'From the Sea: Pearls & Ocean-Inspired Pendants',
    excerpt:
      'A deep dive into our coastal-inspired range — freshwater pearls, sea-blue resin, and the craft of natural material.',
    image: '/product/Scarf Pearl Necklace/2.jpeg',
    paragraphs: [
      'Freshwater pearls are nature\'s most patient creation. Grown over twelve to thirty-six months in carefully managed lake beds, each pearl in our Scarf Pearl Necklace is hand-matched for lustre before stringing.',
      'The Ocean Vibes pendant draws its colour from hand-poured sea-blue resin — mixed in small batches in our Mumbai studio so no two shades are ever identical. The slight variation is intentional; it mirrors the ocean itself.',
      'Both pieces are designed to be worn in multiple ways: the pearl strand long and loose, or doubled and knotted; the ocean pendant layered with the butterfly charm for a coastal editorial look.'
    ],
    technicalNote:
      'Freshwater pearls · Gold-plated clasp · Sea-blue resin pendant · Sterling silver border.',
    referencedProductIds: [203, 204]
  }
];

