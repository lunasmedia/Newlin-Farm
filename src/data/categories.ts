import { colors } from '@/theme/tokens';

export const categories = [
  { slug: 'fruit-veg', name: 'Fruit & veg', emoji: '🥕', backdrop: colors.sage },
  { slug: 'bakery', name: 'Bakery', emoji: '🥖', backdrop: colors.sand },
  { slug: 'dairy-eggs', name: 'Dairy & eggs', emoji: '🥛', backdrop: colors.sky },
  { slug: 'meat-fish', name: 'Meat & fish', emoji: '🥩', backdrop: colors.blush },
  { slug: 'cupboard', name: 'Cupboard', emoji: '🥫', backdrop: colors.sand },
  { slug: 'drinks', name: 'Drinks', emoji: '🧃', backdrop: colors.lavender },
];

export function categoryLabel(name: string) {
  return name;
}
