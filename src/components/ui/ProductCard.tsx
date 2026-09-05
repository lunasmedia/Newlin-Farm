import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/data/products';
import { useFavourites } from '@/state/favourites-context';
import { useBasket } from '@/state/basket-context';
import { useBasketFeedback } from '@/state/basket-feedback-context';
import { ViewportAwareImage } from '@/components/media/ViewportAwareImage';
import { productImageKey, productImagePlaceholder, productImageSource } from '@/lib/product-image';
import { colors, radii, spacing, shadow } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export function ProductCard({ product, width }: { product: Product; width?: number }) {
  const router = useRouter();
  const { isFavourite, toggle } = useFavourites();
  const { add } = useBasket();
  const { showAddedToBasket } = useBasketFeedback();
  const fav = isFavourite(product.id);

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={[styles.card, width ? { width } : { flex: 1 }]}>
      <View style={[styles.imageWrap, { backgroundColor: product.backdrop }]}>
        <ViewportAwareImage
          source={productImageSource(product, 'card')}
          placeholder={productImagePlaceholder(product)}
          imageKey={productImageKey(product, 'card')}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel={product.name}
        />
        {product.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggle(product.id);
          }}
          hitSlop={8}
          style={styles.heart}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={colors.ink} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.description ? (
          <Text style={styles.desc} numberOfLines={1}>
            {product.description}
          </Text>
        ) : null}
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            {product.compareAt ? (
              <Text style={styles.compareAt}>£{product.compareAt.toFixed(2)}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              add(product.id);
              showAddedToBasket(product, 1);
            }}
            testID={`add-to-basket-${product.id}`}
            style={styles.addBtn}>
            <Ionicons name="add" size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: { aspectRatio: 1.15, width: '100%' },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.forest },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.sm },
  category: { fontSize: 10, fontWeight: '700', color: colors.coral, letterSpacing: 0.4 },
  name: { fontFamily: fonts.serifBold, fontSize: 17, color: colors.ink, marginTop: 3, minHeight: 42 },
  desc: { fontSize: 12, color: colors.muted, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  priceGroup: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 16, fontWeight: '800', color: colors.ink },
  compareAt: { fontSize: 12, color: colors.mutedLight, textDecorationLine: 'line-through' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
