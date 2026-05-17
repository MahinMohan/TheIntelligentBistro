import { MenuItem } from './types';

export const menuData: MenuItem[] = [
  // ── STARTERS ──────────────────────────────────────────────────────────────
  {
    id: 'starter-001',
    name: 'Truffle Arancini',
    description:
      'Crispy saffron risotto balls filled with black truffle and aged fontina, served with a truffle aioli and micro herb salad.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    category: 'Starters',
    tags: ['vegetarian', 'popular', 'bestseller'],
    spiceLevel: 0,
  },
  {
    id: 'starter-002',
    name: 'Seared Hokkaido Scallops',
    description:
      'Three hand-dived scallops, golden-seared in clarified butter, with cauliflower purée, crispy capers, and lemon beurre blanc.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80',
    category: 'Starters',
    tags: ['gluten-free', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'starter-003',
    name: 'Burrata & Heirloom Tomato',
    description:
      'House-made burrata on a bed of roasted heirloom tomatoes, basil oil, aged balsamic reduction, and fleur de sel.',
    price: 16,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    category: 'Starters',
    tags: ['vegetarian', 'gluten-free'],
    spiceLevel: 0,
  },
  {
    id: 'starter-004',
    name: 'Nashville Hot Chicken Bites',
    description:
      'Buttermilk-brined chicken tenders, double-fried and glazed in house Nashville hot sauce, with pickles and honey drizzle.',
    price: 17,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80',
    category: 'Starters',
    tags: ['spicy', 'popular'],
    spiceLevel: 3,
  },
  {
    id: 'starter-005',
    name: 'Tuna Tartare',
    description:
      'Sushi-grade yellowfin tuna, avocado, sesame oil, ginger, and tobiko served with wonton crisps and yuzu ponzu.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    category: 'Starters',
    tags: ['gluten-free', 'popular'],
    spiceLevel: 1,
  },

  // ── MAINS ─────────────────────────────────────────────────────────────────
  {
    id: 'main-001',
    name: 'Wagyu Beef Burger',
    description:
      '220g A5 Wagyu patty, aged cheddar, caramelised onion jam, truffle mayo, gem lettuce on a toasted brioche bun with duck-fat fries.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    category: 'Mains',
    tags: ['bestseller', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'main-002',
    name: 'Wild Mushroom Risotto',
    description:
      'Slow-cooked Carnaroli rice with porcini, chanterelle, and king oyster mushrooms, finished with truffle butter, aged Parmesan, and chives.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
    category: 'Mains',
    tags: ['vegetarian', 'gluten-free', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'main-003',
    name: 'Slow-Braised Lamb Tagine',
    description:
      'Moroccan-spiced lamb shoulder braised 8 hours with preserved lemon, olives, apricot, and harissa, served over saffron couscous.',
    price: 38,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    category: 'Mains',
    tags: ['popular', 'spicy'],
    spiceLevel: 2,
  },
  {
    id: 'main-004',
    name: 'Nashville Hot Chicken Sandwich',
    description:
      'Crispy fried chicken thigh drenched in fiery Nashville sauce, pickled jalapeños, coleslaw, and hot honey on a toasted potato bun.',
    price: 24,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
    category: 'Mains',
    tags: ['spicy', 'bestseller'],
    spiceLevel: 3,
  },
  {
    id: 'main-005',
    name: 'Pan-Seared Sea Bass',
    description:
      'Line-caught sea bass, crispy skin, on a bed of celeriac purée, wilted spinach, shellfish bisque, and samphire.',
    price: 36,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    category: 'Mains',
    tags: ['gluten-free', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'main-006',
    name: 'Truffle & Parmesan Gnocchi',
    description:
      'Hand-rolled potato gnocchi in a 24-month Parmesan cream, shaved black truffle, crispy sage, and toasted pine nuts.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80',
    category: 'Mains',
    tags: ['vegetarian'],
    spiceLevel: 0,
  },

  // ── DESSERTS ──────────────────────────────────────────────────────────────
  {
    id: 'dessert-001',
    name: 'Valrhona Chocolate Fondant',
    description:
      'Warm 70% Valrhona chocolate fondant with a molten centre, served with Madagascan vanilla bean ice cream and gold dust.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    category: 'Desserts',
    tags: ['vegetarian', 'bestseller', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'dessert-002',
    name: 'Classic Crème Brûlée',
    description:
      'Silky Tahitian vanilla custard with a perfectly caramelised sugar crust, accompanied by fresh seasonal berries and shortbread.',
    price: 13,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80',
    category: 'Desserts',
    tags: ['vegetarian', 'gluten-free', 'popular'],
    spiceLevel: 0,
  },
  {
    id: 'dessert-003',
    name: 'Lemon Tart',
    description:
      'Sicilian lemon curd in a buttery pâte sablée shell, topped with Italian meringue, candied lemon zest, and raspberry coulis.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=800&q=80',
    category: 'Desserts',
    tags: ['vegetarian'],
    spiceLevel: 0,
  },
  {
    id: 'dessert-004',
    name: 'Sticky Toffee Pudding',
    description:
      'Warm Medjool date sponge drenched in butterscotch toffee sauce, served with clotted cream and a sprinkle of sea salt.',
    price: 13,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    category: 'Desserts',
    tags: ['vegetarian', 'bestseller'],
    spiceLevel: 0,
  },

  // ── DRINKS ────────────────────────────────────────────────────────────────
  {
    id: 'drink-001',
    name: 'Espresso Martini',
    description:
      "Beluga vodka, fresh-pulled double espresso, Kahlúa, and a touch of demerara sugar — topped with a three-bean foam.",
    price: 16,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    category: 'Drinks',
    tags: ['popular', 'bestseller'],
    spiceLevel: 0,
  },
  {
    id: 'drink-002',
    name: 'House Sparkling Lemonade',
    description:
      'Cold-pressed Amalfi lemon juice, house-made lavender syrup, sparkling mineral water, and fresh mint over crushed ice.',
    price: 8,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
    category: 'Drinks',
    tags: ['vegetarian', 'gluten-free'],
    spiceLevel: 0,
  },
  {
    id: 'drink-003',
    name: 'Aged Negroni',
    description:
      'Barrel-aged Hendrick\'s gin, Campari, and Carpano Antica sweet vermouth, served over a large clear ice cube with orange peel.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80',
    category: 'Drinks',
    tags: ['popular'],
    spiceLevel: 0,
  },
  {
    id: 'drink-004',
    name: 'Still or Sparkling Water',
    description:
      'Premium still or sparkling mineral water — Volvic, Evian, or San Pellegrino. Please specify your preference.',
    price: 4,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
    category: 'Drinks',
    tags: ['vegetarian', 'gluten-free'],
    spiceLevel: 0,
  },
  {
    id: 'drink-005',
    name: 'Wildflower Aperol Spritz',
    description:
      'Aperol, Prosecco Superiore, elderflower tonic, edible wildflowers, and orange bitters — the perfect aperitivo.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa0de64888?w=800&q=80',
    category: 'Drinks',
    tags: ['popular'],
    spiceLevel: 0,
  },
];
