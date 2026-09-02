import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBasket } from '@/state/basket-context';
import { colors, spacing } from '@/theme/tokens';

const TABS: {
  route: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconActive: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { route: '/home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { route: '/shop', label: 'Shop', icon: 'search-outline', iconActive: 'search' },
  { route: '/saved', label: 'Saved', icon: 'heart-outline', iconActive: 'heart' },
  { route: '/basket', label: 'Basket', icon: 'basket-outline', iconActive: 'basket' },
  { route: '/account', label: 'Account', icon: 'happy-outline', iconActive: 'happy' },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { totalCount } = useBasket();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TABS.map((tab) => {
        const active =
          pathname === tab.route || (tab.route === '/account' && pathname === '/orders');
        return (
          <Pressable
            key={tab.route}
            onPress={() => {
              if (!active) router.replace(tab.route as any);
            }}
            style={styles.tab}>
            <View>
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={24}
                color={active ? colors.forest : colors.mutedLight}
              />
              {tab.route === '/basket' && totalCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: colors.mutedLight },
  labelActive: { color: colors.forest },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.coral,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
});
