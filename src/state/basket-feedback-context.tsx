import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { AddedToBasketModal } from '@/components/basket/AddedToBasketModal';
import type { Product } from '@/data/products';

type AddedProduct = Pick<
  Product,
  'id' | 'name' | 'image' | 'backdrop' | 'imageUrl' | 'thumbnailUrl' | 'imageBlurhash' | 'imageVersion'
>;

type AddedItem = {
  product: AddedProduct;
  quantity: number;
};

type BasketFeedbackContextValue = {
  showAddedToBasket: (product: AddedProduct, quantity?: number) => void;
  hideAddedToBasket: () => void;
};

const BasketFeedbackContext = createContext<BasketFeedbackContextValue | null>(null);

export function BasketFeedbackProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<AddedItem | null>(null);

  const hideAddedToBasket = useCallback(() => setAddedItem(null), []);

  const showAddedToBasket = useCallback((product: AddedProduct, quantity = 1) => {
    setAddedItem({ product, quantity: Math.max(1, quantity) });
  }, []);

  const goToBasket = useCallback(() => {
    setAddedItem(null);
    router.push('/basket');
  }, [router]);

  const value = useMemo(
    () => ({ showAddedToBasket, hideAddedToBasket }),
    [hideAddedToBasket, showAddedToBasket]
  );

  return (
    <BasketFeedbackContext.Provider value={value}>
      {children}
      <AddedToBasketModal
        visible={Boolean(addedItem)}
        productName={addedItem?.product.name ?? ''}
        product={addedItem?.product}
        productBackdrop={addedItem?.product.backdrop}
        quantity={addedItem?.quantity ?? 1}
        onDismiss={hideAddedToBasket}
        onContinueShopping={hideAddedToBasket}
        onGoToBasket={goToBasket}
      />
    </BasketFeedbackContext.Provider>
  );
}

export function useBasketFeedback() {
  const context = useContext(BasketFeedbackContext);

  if (!context) {
    throw new Error('useBasketFeedback must be used within BasketFeedbackProvider');
  }

  return context;
}
