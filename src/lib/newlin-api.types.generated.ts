// GENERATED FILE — do not edit by hand.
// Regenerate with `npm run sync-api-types`.
// Source: GET /api/v1/schema on Newlin-Farm-Admin.
// Contract version: 1.0

export interface CatalogResponse {
  data: {
    categories: ApiCategory[];
    products: ApiProduct[];
    promotions: ApiPromotion[];
    deliverySlots: ApiDeliverySlot[];
    popularSearches: string[];
    settings: {
      [k: string]: unknown;
    };
  };
  meta: {
    apiVersion: string;
    generatedAt: string;
  };
}
export interface ApiCategory {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  imageBlurhash?: string | null;
  imageVersion?: string | null;
  backdrop: string;
  description: string;
  sortOrder: number;
  active: boolean;
}
export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  longDescription: string;
  price: number;
  compareAt?: number;
  badge?: string;
  imageUrl?: string;
  thumbnailUrl?: string | null;
  imageBlurhash?: string | null;
  imageVersion?: string | null;
  backdrop: string;
  rating: number;
  reviews: number;
  stock: number;
  inStock: boolean;
  featured: boolean;
}
export interface ApiPromotion {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  imageBlurhash?: string | null;
  imageVersion?: string | null;
  accent: string;
  categoryId?: string | null;
  sortOrder: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}
export interface ApiDeliverySlot {
  id: string;
  time: string;
  subtitle: string;
  feePence: number;
  sortOrder: number;
}
