import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { Product } from '@/data/products';
import { useCatalog } from '@/state/catalog-context';

type BasketItem = { productId: string; qty: number };

type BasketContextValue = {
  items: BasketItem[];
  products: (Product & { qty: number })[];
  totalCount: number;
  subtotal: number;
  setQty: (productId: string, qty: number) => void;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  smartSubstitutions: boolean;
  setSmartSubstitutions: (v: boolean) => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const { products: catalogProducts } = useCatalog();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [smartSubstitutions, setSmartSubstitutions] = useState(true);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      const exists = prev.some((i) => i.productId === productId);
      if (!exists) return [...prev, { productId, qty }];
      return prev.map((i) => (i.productId === productId ? { ...i, qty } : i));
    });
  }, []);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const productsWithQty = useMemo(
    () =>
      items
        .map((i) => {
          const p = catalogProducts.find((cp) => cp.id === i.productId);
          return p ? { ...p, qty: i.qty } : null;
        })
        .filter((p): p is Product & { qty: number } => Boolean(p)),
    [items, catalogProducts]
  );

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => productsWithQty.reduce((sum, p) => sum + p.price * p.qty, 0),
    [productsWithQty]
  );

  const value: BasketContextValue = {
    items,
    products: productsWithQty,
    totalCount,
    subtotal,
    setQty,
    add,
    remove,
    clear,
    smartSubstitutions,
    setSmartSubstitutions,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
}
