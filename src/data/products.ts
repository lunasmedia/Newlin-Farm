import { ImageSourcePropType } from 'react-native';
import { colors } from '@/theme/tokens';

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  compareAt?: number;
  badge?: string;
  image: ImageSourcePropType;
  backdrop: string;
  rating?: number;
  reviews?: number;
  longDescription?: string;
};

export const products: Product[] = [
  {
    id: 'strawberries',
    name: 'British Strawberries',
    category: 'Fruit & veg',
    description: 'Sweet and hand-picked · 400g',
    price: 3.25,
    compareAt: 4.0,
    badge: 'Farm favourite',
    image: require('@/assets/farm/strawberries.png'),
    backdrop: colors.blush,
    rating: 4.9,
    reviews: 124,
    longDescription:
      'Sweet, vibrant and full of flavour. Carefully selected from growers who put soil health and taste first.',
  },
  {
    id: 'avocados',
    name: 'Hass Avocados',
    category: 'Fruit & veg',
    description: 'Perfectly ripe · Pack of 2',
    price: 2.6,
    badge: 'Popular',
    image: require('@/assets/farm/avocados.png'),
    backdrop: colors.sage,
    rating: 4.7,
    reviews: 88,
    longDescription: 'Creamy, ready-to-eat avocados picked at peak ripeness for today or tomorrow.',
  },
  {
    id: 'apples',
    name: 'Pink Lady Apples',
    category: 'Fruit & veg',
    description: 'Crisp and juicy · Pack of 6',
    price: 2.75,
    compareAt: 3.2,
    badge: 'Save 45p',
    image: require('@/assets/farm/apples.png'),
    backdrop: colors.blush,
    rating: 4.8,
    reviews: 61,
    longDescription: 'Crisp, sweet-tart apples grown by our orchard partners and picked this week.',
  },
  {
    id: 'sourdough',
    name: 'Country Sourdough',
    category: 'Bakery',
    description: 'Baked this morning · 650g',
    price: 3.5,
    image: require('@/assets/farm/sourdough.png'),
    backdrop: colors.sand,
    rating: 4.9,
    reviews: 152,
    longDescription: 'A crusty country loaf, slow-fermented and baked fresh at our bakehouse this morning.',
  },
  {
    id: 'eggs',
    name: 'Free Range Eggs',
    category: 'Dairy & eggs',
    description: 'British large eggs · Pack of 6',
    price: 2.85,
    badge: 'New',
    image: require('@/assets/farm/eggs.png'),
    backdrop: colors.sand,
    rating: 4.9,
    reviews: 73,
    longDescription: 'Large free-range eggs from British hens roaming pasture all year round.',
  },
  {
    id: 'oat-milk',
    name: 'Oat Barista Milk',
    category: 'Dairy & eggs',
    description: 'Creamy and dairy free · 1L',
    price: 4.2,
    badge: 'New',
    image: require('@/assets/farm/oat-milk.png'),
    backdrop: colors.sand,
    rating: 4.6,
    reviews: 39,
    longDescription: 'Silky, barista-grade oat milk that steams and froths like the dairy classic.',
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
