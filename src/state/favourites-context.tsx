import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { products as allProducts } from '@/data/products';

type FavouritesContextValue = {
  ids: string[];
  isFavourite: (id: string) => boolean;
  toggle: (id: string) => void;
  favourites: typeof allProducts;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([
    'strawberries',
    'avocados',
    'sourdough',
    'eggs',
    'oat-milk',
    'apples',
  ]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isFavourite = useCallback((id: string) => ids.includes(id), [ids]);

  const favourites = useMemo(
    () => allProducts.filter((p) => ids.includes(p.id)),
    [ids]
  );

  return (
    <FavouritesContext.Provider value={{ ids, isFavourite, toggle, favourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
