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
    id: 101,
    sku: 'SC-ER-014',
    name: 'The Luminous Cascade Earrings',
    subtitle: 'Pavé Diamond & Satin-Brushed Gold',
    category: 'Earrings',
    basePriceInr: 118000,
    weightGrams: 6.4,
    caratInfo: '1.40 ctw · IGI F-VS1 Lab Diamonds',
    dimensions: '34 mm drop × 4.2 mm profile',
    hallmark: 'BIS 750 HUID · Mumbai Assay',
    leadTime: 'Dispatches Pan-India in 3 days',
    description:
      'Articulated linear drops calibrated to catch oblique light with minimal motion. Individually bead-set micro-pavé sits flush within hand-burnished satin walls.',
    image1:
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=900',
    image2:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900',
    sizes: ['Standard Drop (34 mm)', 'Petite Drop (26 mm)'],
    sizeLabel: 'Drop Length'
  },
  {
    id: 102,
    sku: 'SC-BR-004',
    name: 'Architectural Cuff No. 4',
    subtitle: 'Heavyweight Forged Solid Gold',
    category: 'Bracelets',
    basePriceInr: 365000,
    weightGrams: 42.6,
    caratInfo: 'Solid Bullion · Zero Hollow Core',
    dimensions: '11.5 mm band width · 3.1 mm wall thickness',
    hallmark: 'BIS 750 HUID · Mumbai Foundry',
    leadTime: 'Made to wrist spec in 7 days',
    description:
      'Hammer-formed from a single solid ingot to balance substantial wrist presence with anatomical curvature. Finished with a subtle interior chamfer for all-day comfort.',
    image1:
      'https://images.unsplash.com/photo-1611591475514-9b2f6ef537d4?auto=format&fit=crop&q=80&w=900',
    image2:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=900',
    sizes: ['S (15.5 cm)', 'M (17.0 cm)', 'L (18.5 cm)'],
    sizeLabel: 'Wrist Circumference'
  },
  {
    id: 103,
    sku: 'SC-RG-009',
    name: 'Celestial Signet Ring',
    subtitle: 'Hand-Bezel Gold & Ceylon Sapphire',
    category: 'Rings',
    basePriceInr: 94500,
    weightGrams: 8.9,
    caratInfo: '0.65 ct · Unheated Blue Sapphire',
    dimensions: '11 mm table × 2.8 mm tapered shank',
    hallmark: 'BIS 750 HUID · Prayagraj Bezel',
    leadTime: 'Dispatches Pan-India in 4 days',
    description:
      'A quiet reinterpretation of classical signet geometry. Deep knife-edge shoulders meet a flush-set octagonal sapphire calibrated for effortless pinkie or index stacking.',
    image1:
      'https://images.unsplash.com/photo-1603561596112-0a131b757442?auto=format&fit=crop&q=80&w=900',
    image2:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
    sizes: ['IN 10', 'IN 12', 'IN 14', 'IN 16', 'IN 18'],
    sizeLabel: 'Ring Size (Indian)',
    stackable: true,
    stackRole: 'Anchor Signet',
    stackWidthMm: 2.8
  },
  {
    id: 104,
    sku: 'SC-RG-001',
    name: 'The Shreya Diamond Solitaire',
    subtitle: '1.50 ct Lab Solitaire · Cathedral Bezel',
    category: 'Rings',
    basePriceInr: 165000,
    weightGrams: 5.2,
    caratInfo: '1.50 ct · IGI D-VVS1 Ideal Cut',
    dimensions: '2.2 mm low-profile band · 5.8 mm crown',
    hallmark: 'BIS 750 HUID · IGI Dossier',
    leadTime: 'Calibrated to size in 5 days',
    description:
      'Suspended inside an open gallery so daylight enters from every azimuth. Engineered with a flat internal profile that sits flush alongside neighboring bands.',
    image1:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
    image2:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=900',
    sizes: ['IN 10', 'IN 12', 'IN 14', 'IN 16'],
    sizeLabel: 'Ring Size (Indian)',
    stackable: true,
    stackRole: 'Primary Solitaire',
    stackWidthMm: 2.2
  },
  {
    id: 105,
    sku: 'SC-RG-002',
    name: 'Solstice Pavé Band',
    subtitle: 'Full-Eternity Micro-Set Diamonds',
    category: 'Rings',
    basePriceInr: 68500,
    weightGrams: 3.1,
    caratInfo: '0.85 ctw · E-F VS Clarity',
    dimensions: '1.8 mm width · 1.7 mm height',
    hallmark: 'BIS 750 HUID · Precision Pavé',
    leadTime: 'Dispatches Pan-India in 2 days',
    description:
      'Thirty-eight individually matched stones set under stereo microscopy for minimal metal visibility and uninterrupted brilliance across a full 360-degree band.',
    image1:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=900',
    image2:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
    sizes: ['IN 10', 'IN 12', 'IN 14', 'IN 16'],
    sizeLabel: 'Ring Size (Indian)',
    stackable: true,
    stackRole: 'Spacer & Guard',
    stackWidthMm: 1.8
  },
  {
    id: 106,
    sku: 'SC-NK-007',    name: 'Elysian Herringbone Chain',
    subtitle: 'Fluid Heavyweight 18k Link Drape',
    category: 'Necklaces',
    basePriceInr: 142000,
    weightGrams: 18.4,
    caratInfo: 'Solid Diamond-Cut Woven Links',
    dimensions: '4.5 mm ribbon width · Box clasp with safety',
    hallmark: 'BIS 750 HUID · Zaveri Linkwork',
    leadTime: 'Dispatches Pan-India in 3 days',
    description:
      'Milled in Mumbai from flat-rolled gold wire that drapes along the collarbone like liquid silk while resisting kinking through reinforced internal tension pins.',
    image1: '/hero-product-1.jpg',
    image2: '/hero-product-2.webp',
    sizes: ['16"', '18"', '20"'],
    sizeLabel: 'Chain Length',
    stackable: true,
    stackRole: 'Collarbone Anchor',
    stackWidthMm: 4.5
  },
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
    id: 'geometry-solid-cuffs',
    date: 'January 14, 2026',
    readTime: '4 min read',
    author: 'Arjun Kulkarni, Master Karigar',
    atelier: 'Mumbai Foundry',
    title: 'The Geometry of Solid Gold Cuffs',
    excerpt:
      'How architectural weight distribution and interior chamfering transform the tactile permanence of everyday fine jewelry.',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1100',
    paragraphs: [
      'A hollow-core bracelet feels bright for an afternoon and hollow for a lifetime. When we began drafting Architectural Cuff No. 4 in Mumbai, our sole constraint was refusing internal voids: every gram had to belong to continuous 750 solid alloy.',
      'Weight alone, however, quickly becomes fatigue if mass is distributed poorly around the ulna. By tapering the wall thickness from 3.1 millimeters along the dorsal curve to 2.4 millimeters near the wrist opening, the cuff settles naturally against the bone rather than rotating forward.',
      'We finish the interior not with high mirror buffing—which clings when warm—but with a fine 1,200-grit satin cross-grain. Over months of wear, skin oils burnish only the highest edges, building a quiet patina unique to the wearer.'
    ],
    technicalNote:
      'Alloy standard: 75% pure recycled gold, 13% fine silver, 12% electrolytic copper — annealed twice at 620 °C.',
    referencedProductIds: [102, 106]
  },
  {
    id: 'conflict-free-solitaires',
    date: 'December 28, 2025',
    readTime: '5 min read',
    author: 'Dr. Meera Iyer, Gemologist FGA',
    atelier: 'Prayagraj Gem Lab',
    title: 'Sourcing Conflict-Free Lab Solitaires',
    excerpt:
      'A transparent examination into CVD crystal cultivation, optical light-return grading, and full-chain traceability.',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1100',
    paragraphs: [
      'True optical fire has little to do with geological nostalgia and everything to do with atomic lattice purity. Modern Type IIa stones grown through controlled chemical vapor deposition exhibit zero nitrogen impurities—a clarity grade attained by fewer than two percent of mined diamonds.',
      'Within the Shreya & Co. Prayagraj gem laboratory, fewer than one in twelve certified stones passes our secondary proportion audit. We reject deep-bellied cuts engineered purely to preserve carat weight on a scale, selecting instead shallow-table ideal angles that return crisp white light in low interior rooms.',
      'Every solitaire above 0.50 carats arrives laser-inscribed on its girdle with an independent IGI dossier reference and origin energy audit, ensuring complete transparency from laboratory chamber to bezel.'
    ],
    technicalNote:
      'Standard grading floor: Color D–F, Clarity VVS1–VS1, Cut Proportions Ideal, 100% renewable crystal synthesis.',
    referencedProductIds: [104, 105]
  }
];

