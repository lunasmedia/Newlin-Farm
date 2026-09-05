import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppShell } from '@/components/layout/AppShell';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { NewlinImage } from '@/components/media/NewlinImage';
import { productImageKey, productImagePlaceholder, productImageSource } from '@/lib/product-image';
import { useBasket } from '@/state/basket-context';
import { useCatalog } from '@/state/catalog-context';
import { normalizeStoreSettings } from '@/utils/store-settings';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function Basket() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products, totalCount, subtotal, setQty, smartSubstitutions, setSmartSubstitutions } =
    useBasket();
  const { settings, deliverySlots } = useCatalog();
  const [promoOpen, setPromoOpen] = useState(false);
  const { freeDeliveryThresholdPence, minimumOrderPence } = normalizeStoreSettings(settings);
  const freeDeliveryThreshold = freeDeliveryThresholdPence / 100;
  const minimumOrder = minimumOrderPence / 100;
  const freeDelivery = subtotal >= freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = freeDeliveryThreshold > 0 ? Math.min(100, (subtotal / freeDeliveryThreshold) * 100) : 100;
  const meetsMinimumOrder = subtotal >= minimumOrder;
  const remainingForMinimumOrder = Math.max(0, minimumOrder - subtotal);
  // The exact fee depends on which slot is picked on the next screen — this
  // is just the best-case estimate shown before that choice, using the
  // cheapest slot an admin currently offers (waived to £0 once the free
  // delivery threshold above is met, same as checkout applies it later).
  const cheapestSlotFeePence = deliverySlots.length
    ? Math.min(...deliverySlots.map((s) => s.feePence))
    : 0;
  const estimatedDeliveryFee = freeDelivery ? 0 : cheapestSlotFeePence / 100;

  if (products.length === 0) {
    return (
      <AppShell>
        <View style={[styles.empty, { paddingTop: insets.top + spacing.xxl }]}>
          <Text style={styles.emptyEmoji}>🧺</Text>
          <Text style={styles.emptyTitle}>Your basket is empty</Text>
          <Button label="Start shopping" onPress={() => router.push('/shop')} style={{ marginTop: spacing.lg }} />
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
          <View>
            <Text style={styles.eyebrow}>ALMOST THERE</Text>
            <Text style={styles.title}>Your basket</Text>
          </View>
          <View style={styles.itemsPill}>
            <Text style={styles.itemsPillText}>{totalCount} items</Text>
          </View>
        </View>

        {freeDeliveryThreshold > 0 ? (
          <View style={styles.freeBanner}>
            <Text style={{ fontSize: 22 }}>🚲</Text>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.freeTitle}>
                {freeDelivery
                  ? "You've unlocked free delivery"
                  : `Add £${remainingForFreeDelivery.toFixed(2)} more for free delivery`}
              </Text>
              <Text style={styles.freeSubtitle}>{freeDelivery ? 'Nice one, neighbour.' : "You're getting close!"}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${freeDeliveryProgress}%` }]} />
              </View>
            </View>
          </View>
        ) : null}

        {!meetsMinimumOrder && minimumOrder > 0 ? (
          <View style={styles.minOrderNotice}>
            <Ionicons name="information-circle-outline" size={16} color={colors.coral} />
            <Text style={styles.minOrderText}>
              Add £{remainingForMinimumOrder.toFixed(2)} more to reach the £{minimumOrder.toFixed(2)} minimum order.
            </Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {products.map((item, i) => (
            <View key={item.id} style={[styles.row, i > 0 && styles.rowBorder]}>
              <NewlinImage
                visible
                source={productImageSource(item, 'card')}
                placeholder={productImagePlaceholder(item)}
                imageKey={productImageKey(item, 'card')}
                style={styles.thumb}
                contentFit="cover"
                accessibilityLabel={item.name}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
              </View>
              <QuantityStepper vertical value={item.qty} onChange={(n) => setQty(item.id, n)} />
            </View>
          ))}
        </View>

        <View style={styles.substituteRow}>
          <View style={styles.substituteIcon}>
            <Ionicons name="repeat" size={18} color={colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.substituteTitle}>Smart substitutions</Text>
            <Text style={styles.substituteSubtitle}>Swap unavailable items for the closest match.</Text>
          </View>
          <Pressable
            onPress={() => setSmartSubstitutions(!smartSubstitutions)}
            style={[styles.toggle, smartSubstitutions && styles.toggleOn]}>
            <View style={[styles.toggleThumb, smartSubstitutions && styles.toggleThumbOn]} />
          </Pressable>
        </View>

        <Pressable style={styles.promoRow} onPress={() => setPromoOpen((v) => !v)}>
          <Ionicons name="sparkles-outline" size={18} color={colors.ink} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.promoTitle}>Add a promo code</Text>
            <Text style={styles.promoSubtitle}>Enter a voucher or Field Notes reward</Text>
          </View>
          <Ionicons name={promoOpen ? 'chevron-down' : 'chevron-forward'} size={18} color={colors.mutedLight} />
        </Pressable>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>
              {estimatedDeliveryFee === 0 ? 'FREE' : `From £${estimatedDeliveryFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Estimated total</Text>
            <Text style={styles.summaryValueBold}>£{(subtotal + estimatedDeliveryFee).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button
          label={
            meetsMinimumOrder
              ? `Choose delivery · £${(subtotal + estimatedDeliveryFee).toFixed(2)}`
              : `Minimum order £${minimumOrder.toFixed(2)}`
          }
          arrow
          disabled={!meetsMinimumOrder}
          onPress={() => router.push('/checkout/delivery')}
        />
      </View>
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
  itemsPill: { backgroundColor: colors.sage, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  itemsPillText: { fontSize: 13, fontWeight: '800', color: colors.forest },
  freeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forest,
    marginHorizontal: spacing.lg,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  freeTitle: { color: colors.white, fontWeight: '800', fontSize: 15 },
  freeSubtitle: { color: '#CFE0D6', fontSize: 12, marginTop: 2 },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.gold, borderRadius: 2 },
  minOrderNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.blush,
  },
  minOrderText: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.coral },
  list: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.md, alignItems: 'center' },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  thumb: { width: 68, height: 68, borderRadius: radii.md },
  category: { fontSize: 10, fontWeight: '800', color: colors.coral, letterSpacing: 0.5 },
  name: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink, marginTop: 2 },
  desc: { fontSize: 12, color: colors.muted, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '800', color: colors.ink, marginTop: 4 },
  substituteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sage,
    marginHorizontal: spacing.lg,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  substituteIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  substituteTitle: { fontSize: 15, fontWeight: '800', color: colors.ink, marginLeft: spacing.sm },
  substituteSubtitle: { fontSize: 12, color: colors.muted, marginLeft: spacing.sm, marginTop: 2 },
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: '#D8D2C1', padding: 3 },
  toggleOn: { backgroundColor: colors.forest },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
  toggleThumbOn: { marginLeft: 18 },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  promoTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  promoSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  summary: {
    backgroundColor: colors.inputBg,
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  summaryLabel: { fontSize: 14, color: colors.body },
  summaryValue: { fontSize: 14, fontWeight: '700', color: colors.ink },
  summaryDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xs },
  summaryLabelBold: { fontSize: 16, fontWeight: '800', color: colors.ink },
  summaryValueBold: { fontSize: 16, fontWeight: '800', color: colors.ink },
  footer: {
    backgroundColor: colors.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    padding: spacing.lg,
  },
  empty: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.ink, marginTop: spacing.md },
});
