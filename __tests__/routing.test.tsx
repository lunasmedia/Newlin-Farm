import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from '../src/app/home';
import SignIn from '../src/app/sign-in';
import { BasketProvider } from '../src/state/basket-context';
import { FavouritesProvider } from '../src/state/favourites-context';
import { BasketFeedbackProvider } from '../src/state/basket-feedback-context';
import { CatalogProvider } from '../src/state/catalog-context';
import { AddressesProvider } from '../src/state/addresses-context';

const testMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function withProviders(children: React.ReactElement) {
  return (
    <SafeAreaProvider initialMetrics={testMetrics}>
      <CatalogProvider>
        <BasketProvider>
          <BasketFeedbackProvider>
            <FavouritesProvider>
              <AddressesProvider>{children}</AddressesProvider>
            </FavouritesProvider>
          </BasketFeedbackProvider>
        </BasketProvider>
      </CatalogProvider>
    </SafeAreaProvider>
  );
}

describe('Routing screens', () => {
  it('renders the Home screen content', async () => {
    const { getByText } = await render(withProviders(<Home />));
    expect(getByText('Shop by category')).toBeTruthy();
    expect(getByText('Popular right now')).toBeTruthy();
  });

  it('renders the Sign in screen content', async () => {
    const { getByText } = await render(withProviders(<SignIn />));
    expect(getByText('Good to see you again')).toBeTruthy();
  });
});
