import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  { route: '/account', label: 'Account', icon: 'happy-outline', iconActive: 'happy' },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TABS.map((tab) => {
        const onExactRoute = pathname === tab.route;
        // Orders is a pushed sub-screen of Account (see account.tsx /
        // orders.tsx), not its own tab, so it's styled as part of the
        // Account tab here — but that's a visual grouping only. Whether a
        // tap actually navigates still goes by the exact route: without
        // this split, tapping the (visually active) Account tab while on
        // Orders did nothing, leaving the tab bar as a dead end back to it.
        const active = onExactRoute || (tab.route === '/account' && pathname === '/orders');
        return (
          <Pressable
            key={tab.route}
            testID={`tab-${tab.route.slice(1)}`}
            onPress={() => {
              if (!onExactRoute) router.replace(tab.route as any);
            }}
            style={styles.tab}>
            <View>
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={24}
                color={active ? colors.forest : colors.mutedLight}
              />
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
});
