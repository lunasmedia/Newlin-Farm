import React, { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '@expo-google-fonts/lora';
import { serifFonts } from '@/theme/fonts';
import { colors } from '@/theme/tokens';
import { BasketProvider } from '@/state/basket-context';
import { FavouritesProvider } from '@/state/favourites-context';
import { AddressesProvider } from '@/state/addresses-context';
import { BasketFeedbackProvider } from '@/state/basket-feedback-context';
import { CheckoutProvider } from '@/state/checkout-context';
import { AuthProvider } from '@/state/auth-context';
import { CatalogProvider } from '@/state/catalog-context';
import { OrdersProvider } from '@/state/orders-context';
import { useAppHeartbeat } from '@/hooks/use-app-heartbeat';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  useAppHeartbeat();
  const [fontsLoaded] = useFonts(serifFonts);

  const onLayout = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.cream }} onLayout={onLayout}>
        <AuthProvider>
          {/* Needs the signed-in Firebase user (for the ID token) from
              AuthProvider above it — refetches whenever that user changes. */}
          <OrdersProvider>
          {/* Above Basket/Favourites — both read live product data (price,
              stock, images) from the catalogue rather than the bundled
              static list, so an admin edit is reflected there too. */}
          <CatalogProvider>
            <BasketProvider>
              {/* Renders the "Added to basket" modal itself (see
                  basket-feedback-context.tsx) — a real RN Modal, so it
                  portals natively rather than needing to be mounted as an
                  explicit sibling of Stack. */}
              <BasketFeedbackProvider>
                <FavouritesProvider>
                  <AddressesProvider>
                    <CheckoutProvider>
                      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
                        <Stack.Screen name="index" />
                        {/* The 5 tab-bar buttons switch via router.replace (see TabBar), not
                            push — give them no transition so switching tabs feels instant,
                            like a real tab bar, instead of sliding like a drill-down screen.
                            "orders" is reached by a normal push from the Account menu, so it
                            keeps the default slide animation. */}
                        <Stack.Screen name="home" options={{ animation: 'none' }} />
                        <Stack.Screen name="shop" options={{ animation: 'none' }} />
                        <Stack.Screen name="saved" options={{ animation: 'none' }} />
                        <Stack.Screen name="basket" options={{ animation: 'none' }} />
                        <Stack.Screen name="account" options={{ animation: 'none' }} />
                      </Stack>
                    </CheckoutProvider>
                  </AddressesProvider>
                </FavouritesProvider>
              </BasketFeedbackProvider>
            </BasketProvider>
          </CatalogProvider>
          </OrdersProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
