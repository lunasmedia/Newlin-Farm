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
import { CheckoutProvider } from '@/state/checkout-context';
import { AuthProvider } from '@/state/auth-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
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
          <BasketProvider>
            <FavouritesProvider>
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
            </FavouritesProvider>
          </BasketProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
