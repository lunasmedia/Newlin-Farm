import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppShell } from '@/components/layout/AppShell';
import { ProductCard } from '@/components/ui/ProductCard';
import { useFavourites } from '@/state/favourites-context';
import { useBasket } from '@/state/basket-context';
import { useBasketFeedback } from '@/state/basket-feedback-context';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function Saved() {
  const insets = useSafeAreaInsets();
  const { favourites } = useFavourites();
  const { add } = useBasket();
  const { showAddedToBasket } = useBasketFeedback();

  return (
    <AppShell>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
          <View>
            <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
            <Text style={styles.title}>Saved favourites</Text>
          </View>
          <View style={styles.moreCircle}>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.ink} />
          </View>
        </View>

        <View style={styles.callout}>
          <View style={styles.calloutIcon}>
            <Ionicons name="heart" size={18} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.calloutTitle}>Your weekly staples</Text>
            <Text style={styles.calloutSubtitle}>
              Add all {favourites.length} favourites to your basket in one tap.
            </Text>
          </View>
          <Pressable
            style={styles.addAllBtn}
            onPress={() => {
              favourites.forEach((p) => add(p.id));
              // The redesigned modal shows one product + a quantity, not a
              // distinct "bulk, no single product" mode — the first
              // favourite stands in, with the count communicating "more
              // than one item" rather than literally that many of it.
              if (favourites.length) showAddedToBasket(favourites[0], favourites.length);
            }}>
            <Text style={styles.addAllText}>+ Add all</Text>
          </Pressable>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{favourites.length} saved items</Text>
          <Pressable style={styles.sortBtn}>
            <Text style={styles.sortText}>Recently added ⌄</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {favourites.map((p) => (
            <View key={p.id} style={styles.gridItem}>
              <ProductCard product={p} />
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  eyebrow: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 0.5 },
  title: { fontFamily: fonts.serifBold, fontSize: 32, color: colors.ink, marginTop: 2 },
  moreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
  },
  calloutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  calloutSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  addAllBtn: { backgroundColor: colors.white, borderRadius: radii.pill, paddingVertical: 10, paddingHorizontal: spacing.sm },
  addAllText: { fontSize: 13, fontWeight: '800', color: colors.ink },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listTitle: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.ink },
  sortBtn: { backgroundColor: colors.inputBg, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  sortText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm },
  gridItem: { width: '47%' },
});
