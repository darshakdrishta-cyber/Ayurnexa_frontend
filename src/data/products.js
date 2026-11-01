export const CATEGORIES = [
  { id: 'all', name: 'All products', emoji: '✦' },
  { id: 'oils', name: 'Oils', emoji: '🫙' },
  { id: 'capsules', name: 'Capsules', emoji: '💊' },
  { id: 'drops', name: 'Drops', emoji: '💧' },
  { id: 'tablets', name: 'Tablets', emoji: '💊' },
  { id: 'serums', name: 'Serums', emoji: '✨' },
]

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]))

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=75`

export const PRODUCTS = [
  {
    id: 'shilajit-gold-oil',
    name: 'Shilajit Gold Oil',
    category: 'oils',
    price: 649,
    rating: 4.9,
    reviews: 412,
    desc: 'Potent shilajit-infused massage oil for stamina, vitality and nightly recovery.',
    tag: 'Bestseller',
    image: img('1607082348742-c079b36e008d'),
  },
  {
    id: 'ashwa-power-capsules',
    name: 'Ashwa Power Capsules',
    category: 'capsules',
    price: 549,
    rating: 4.8,
    reviews: 338,
    desc: 'KSM-66 ashwagandha capsules for energy, strength and daily performance.',
    tag: 'New',
    image: img('1610409831466-6c9013219f6e'),
  },
  {
    id: 'vigour-drops',
    name: 'Vigour Drops',
    category: 'drops',
    price: 449,
    rating: 4.7,
    reviews: 276,
    desc: 'Fast-acting herbal drops for energy and confidence before intimate moments.',
    image: img('1596572057216-03c4b836f9a6'),
  },
  {
    id: 'shatavari-tablets',
    name: 'Shatavari Tablets',
    category: 'tablets',
    price: 399,
    rating: 4.6,
    reviews: 194,
    desc: 'Balance and reproductive wellness support for sustained energy.',
    image: img('1600271886742-f049cd451bba'),
  },
  {
    id: 'safed-musli-serum',
    name: 'Safed Musli Serum',
    category: 'serums',
    price: 749,
    rating: 4.9,
    reviews: 158,
    desc: 'Concentrated musli extract serum for strength, stamina and endurance.',
    tag: 'Premium',
    image: img('1615485290382-441e4d049cb5'),
  },
  {
    id: 'gokshura-capsules',
    name: 'Gokshura Capsules',
    category: 'capsules',
    price: 499,
    rating: 4.7,
    reviews: 261,
    desc: 'Natural vitality booster for drive, strength and everyday performance.',
    image: img('1571781926291-c477ebfd024b'),
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.slice(0, 4)
