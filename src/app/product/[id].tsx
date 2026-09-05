import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCatalog } from '@/state/catalog-context';
import { useFavourites } from '@/state/favourites-context';
import { useBasket } from '@/state/basket-context';
import { useBasketFeedback } from '@/state/basket-feedback-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { NewlinImage } from '@/components/media/NewlinImage';
import { productImageKey, productImagePlaceholder, productImageSource } from '@/lib/product-image';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

const ACCORDIONS = ['Ingredients & nutrition', 'Delivery & substitutions'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products, loading } = useCatalog();
  const product = products.find((p) => p.id === id);
  const { isFavourite, toggle } = useFavourites();
  const { add } = useBasket();
  const { showAddedToBasket } = useBasketFeedback();
  const [qty, setQty] = useState(1);
  const [openLove, setOpenLove] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (!product) {
    // A product that only exists remotely (added after this build shipped,
    // so it's not in the bundled fallback) won't resolve until the first
    // catalogue fetch settles — show a loader rather than a false "not
    // found" for that brief window.
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        {loading ? (
          <ActivityIndicator color={colors.forest} />
        ) : (
          <Text>Product not found.</Text>
        )}
      </View>
    );
  }

  const fav = isFavourite(product.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={[styles.photoWrap, { backgroundColor: product.backdrop }]}>
          <NewlinImage
            visible
            priority="high"
            source={productImageSource(product, 'detail')}
            placeholder={productImagePlaceholder(product)}
            imageKey={productImageKey(product, 'detail')}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={product.name}
          />
          <View style={[styles.photoTopRow, { top: insets.top + spacing.sm }]}>
            <IconCircle name="chevron-back" onPress={() => router.back()} />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <IconCircle name="arrow-redo-outline" />
              <IconCircle
                name={fav ? 'heart' : 'heart-outline'}
                color={fav ? colors.coral : colors.ink}
                onPress={() => toggle(product.id)}
              />
            </View>
          </View>
          {product.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>{product.category.toUpperCase()} · NEWLIN SELECT</Text>
              <Text style={styles.title}>{product.name}</Text>
            </View>
            {product.rating ? (
              <View style={styles.ratingWrap}>
                <Text style={styles.ratingValue}>★ {product.rating}</Text>
                <Text style={styles.ratingCount}>{product.reviews} reviews</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs }}>
              <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
              {product.compareAt ? (
                <Text style={styles.compareAt}>£{product.compareAt.toFixed(2)}</Text>
              ) : null}
            </View>
            <Text style={styles.perItem}>Price per item</Text>
          </View>

          <View style={styles.promise}>
            <View style={styles.promiseIcon}>
              <Text style={{ fontSize: 18 }}>🌱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.promiseTitle}>Freshness promise</Text>
              <Text style={styles.promiseSubtitle}>
                Picked for flavour, checked by hand and delivered chilled.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.forest} />
          </View>

          <Divider style={{ marginTop: spacing.lg }} />
          <Pressable style={styles.accordionRow} onPress={() => setOpenLove((v) => !v)}>
            <Text style={styles.accordionTitle}>Why you&apos;ll love it</Text>
            <Ionicons name={openLove ? 'chevron-up' : 'chevron-down'} size={18} color={colors.ink} />
          </Pressable>
          {openLove ? <Text style={styles.accordionBody}>{product.longDescription}</Text> : null}

          {ACCORDIONS.map((title) => (
            <React.Fragment key={title}>
              <Divider />
              <Pressable
                style={styles.accordionRow}
                onPress={() => setOpenAccordion((cur) => (cur === title ? null : title))}>
                <Text style={styles.accordionTitle}>{title}</Text>
                <Ionicons
                  name={openAccordion === title ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.ink}
                />
              </Pressable>
              {openAccordion === title ? (
                <Text style={styles.accordionBody}>
                  {title === 'Ingredients & nutrition'
                    ? 'Single-ingredient fresh produce. See pack for full nutrition information.'
                    : 'Delivered chilled within your chosen window. If unavailable, we\'ll pick the closest match unless you turn off substitutions.'}
                </Text>
              ) : null}
            </React.Fragment>
          ))}
          <Divider />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
        <Button
          label={`Add · £${(product.price * qty).toFixed(2)}`}
          onPress={() => {
            add(product.id, qty);
            showAddedToBasket(product, qty);
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoWrap: { width: '100%', aspectRatio: 1, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  photoTopRow: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.forest },
  body: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 0.5 },
  title: { fontFamily: fonts.serifBold, fontSize: 34, color: colors.ink, lineHeight: 38, marginTop: 4, maxWidth: 260 },
  ratingWrap: { alignItems: 'flex-end' },
  ratingValue: { fontSize: 16, fontWeight: '800', color: colors.ink },
  ratingCount: { fontSize: 12, color: colors.muted, marginTop: 2 },
  description: { fontSize: 15, color: colors.muted, marginTop: spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: spacing.md },
  price: { fontSize: 30, fontWeight: '800', color: colors.ink },
  compareAt: { fontSize: 16, color: colors.mutedLight, textDecorationLine: 'line-through' },
  perItem: { fontSize: 13, color: colors.muted },
  promise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  promiseIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  promiseTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  promiseSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  accordionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  accordionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  accordionBody: { fontSize: 14, color: colors.muted, lineHeight: 20, paddingBottom: spacing.md },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
  },
});
