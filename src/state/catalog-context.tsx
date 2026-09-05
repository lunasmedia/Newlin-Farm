import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, ImageSourcePropType } from 'react-native';
import { Product, products as localProducts, productImageFallbacks } from '@/data/products';
import { categories as localCategories } from '@/data/categories';
import { ApiCategory, ApiDeliverySlot, ApiProduct, ApiPromotion, fetchCatalog } from '@/lib/newlin-api';

export type Category = { slug: string; name: string; emoji: string; backdrop: string };

// Bundled fallback so checkout has real, sensible slots on the very first
// frame (and if the app never gets online) — same reasoning as
// localProducts/localCategories below, and the exact values this screen
// used to hardcode directly before delivery slots became admin-managed.
const localDeliverySlots: ApiDeliverySlot[] = [
  { id: 'morning-9-10', time: '09:00 – 10:00', subtitle: 'One-hour window', feePence: 150, sortOrder: 1 },
  { id: 'morning-10-11', time: '10:00 – 11:00', subtitle: 'Most popular', feePence: 0, sortOrder: 2 },
  { id: 'midday-12-13', time: '12:00 – 13:00', subtitle: 'One-hour window', feePence: 0, sortOrder: 3 },
  { id: 'evening-17-18', time: '17:00 – 18:00', subtitle: 'One-hour window', feePence: 200, sortOrder: 4 },
];

// Generic placeholder for a product the admin added with no photo yet and
// no bundled fallback — reuses the hero's produce-bag image rather than
// shipping a dedicated "no image" asset.
const genericProductImage: ImageSourcePropType = require('@/assets/farm/hero-bag.png');

function toProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    compareAt: p.compareAt,
    badge: p.badge,
    image: p.imageUrl ? { uri: p.imageUrl } : productImageFallbacks[p.id] ?? genericProductImage,
    imageUrl: p.imageUrl,
    thumbnailUrl: p.thumbnailUrl,
    imageBlurhash: p.imageBlurhash,
    imageVersion: p.imageVersion,
    backdrop: p.backdrop,
    rating: p.rating,
    reviews: p.reviews,
    longDescription: p.longDescription,
  };
}

function toCategory(c: ApiCategory): Category {
  return { slug: c.id, name: c.name, emoji: c.emoji, backdrop: c.backdrop };
}

// How often to silently re-poll the catalogue in the background, so a
// category/product an admin adds shows up on its own without the user
// having to pull-to-refresh. The admin API is plain REST (no
// websocket/SSE push endpoint), so polling is the only way to pick up
// remote changes short of a manual refresh.
const POLL_INTERVAL_MS = 60_000;

type CatalogContextValue = {
  products: Product[];
  categories: Category[];
  promotions: ApiPromotion[];
  deliverySlots: ApiDeliverySlot[];
  settings: Record<string, unknown>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  // Starts from the bundled catalogue so every screen has real data (and
  // real product photos) on the very first frame, before the network
  // request has even started — and stays on it for good if the app never
  // gets online.
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [rawCategories, setRawCategories] = useState<Category[]>(localCategories);
  const [promotions, setPromotions] = useState<ApiPromotion[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<ApiDeliverySlot[]>(localDeliverySlots);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  // True only until the first request settles (success or failure) — this
  // is "do we have nothing but the bundled fallback yet", not "is a
  // request in flight", so pull-to-refresh doesn't retrigger a full-screen
  // loading state.
  // Only ever true->false once, on whichever request (success or failure)
  // settles first — later `refresh()` calls (e.g. pull-to-refresh) update
  // the data in place without flipping this back on, per "keep the
  // previous catalogue visible while refreshing".
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Guards against overlapping requests — the poll interval firing while a
  // pull-to-refresh (or the previous poll) is still in flight.
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const res = await fetchCatalog();
      setProducts(res.data.products.map(toProduct));
      setRawCategories(res.data.categories.map(toCategory));
      setPromotions(res.data.promotions.filter((promo) => promo.active));
      setDeliverySlots(res.data.deliverySlots);
      setSettings(res.data.settings);
      setError(null);
    } catch (e) {
      // Leave whatever's currently loaded in place — the last successful
      // remote fetch, or the bundled local catalogue on a first launch
      // with no connection — rather than clearing it out from under the
      // user. Logged rather than surfaced in the UI, since a silent
      // fallback to bundled data can otherwise look like the API was never
      // wired up at all (e.g. a `localhost` URL unreachable from an
      // Android emulator or device — see `resolveApiUrl` in newlin-api.ts).
      console.warn('[catalog] fetchCatalog failed, keeping current data:', e);
      setError(e instanceof Error ? e.message : 'Failed to load catalogue');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Own ignore-guarded fetch rather than calling `load()` — see the same
    // pattern (and why) in orders-context.tsx. `load` itself stays as the
    // reusable pull-to-refresh / poll-interval handler below, where an
    // unguarded setState is exactly what's wanted.
    let ignore = false;
    (async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        const res = await fetchCatalog();
        if (!ignore) {
          setProducts(res.data.products.map(toProduct));
          setRawCategories(res.data.categories.map(toCategory));
          setPromotions(res.data.promotions.filter((promo) => promo.active));
          setDeliverySlots(res.data.deliverySlots);
          setSettings(res.data.settings);
          setError(null);
        }
      } catch (e) {
        console.warn('[catalog] fetchCatalog failed, keeping current data:', e);
        if (!ignore) setError(e instanceof Error ? e.message : 'Failed to load catalogue');
      } finally {
        if (!ignore) setLoading(false);
        loadingRef.current = false;
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // Silent background poll, plus an immediate refetch whenever the app
    // comes back to the foreground — the closest thing to "the API pushes
    // data automatically" a plain REST endpoint allows. Neither ever shows
    // the full-screen loader (`loading` only ever flips true -> false once,
    // in the mount effect above) — the current catalogue stays visible
    // while these update it underneath.
    const interval = setInterval(load, POLL_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') load();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [load]);

  // A category with zero active products in it is hidden rather than shown
  // empty — e.g. an admin has created "Cupboard" but not added any products
  // to it yet. Matches products to categories the same way the shop screen's
  // own category filter does (by name), so this list and that filter never
  // disagree about which categories are "real".
  const categories = useMemo(
    () => rawCategories.filter((cat) => products.some((p) => p.category === cat.name)),
    [rawCategories, products]
  );

  const value: CatalogContextValue = {
    products,
    categories,
    promotions,
    deliverySlots,
    settings,
    loading,
    error,
    refresh: load,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
