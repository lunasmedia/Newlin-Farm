import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppShell } from '@/components/layout/AppShell';
import { Chip } from '@/components/ui/Chip';
import { ProductCard } from '@/components/ui/ProductCard';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { useCatalog } from '@/state/catalog-context';

export default function Shop() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const { products, categories } = useCatalog();
  const [active, setActive] = useState('all');

  useEffect(() => {
    if (params.category) setActive(params.category);
  }, [params.category]);

  const filtered = useMemo(() => {
    if (active === 'all') return products;
    const cat = categories.find((c) => c.slug === active);
    if (!cat) return products;
    return products.filter((p) => p.category === cat.name);
  }, [active, products, categories]);

  return (
    <AppShell>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>EXPLORE</Text>
            <Text style={styles.title}>Shop the farm</Text>
          </View>
          <Pressable style={styles.searchCircle} onPress={() => router.push('/search')}>
            <Ionicons name="search" size={18} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
          <Chip label="All" active={active === 'all'} onPress={() => setActive('all')} />
          {categories.map((c) => (
            <Chip
              key={c.slug}
              label={c.name}
              active={active === c.slug}
              onPress={() => setActive(c.slug)}
            />
          ))}
        </ScrollView>

        <Pressable style={styles.banner}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>JUST PICKED</Text>
          </View>
          <Text style={styles.bannerTitle}>Summer's best,{'\n'}all in one basket.</Text>
          <Text style={styles.bannerLink}>Explore seasonal →</Text>
          <View style={styles.bannerImage}>
            <Text style={{ fontSize: 40 }}>🍓</Text>
          </View>
        </Pressable>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All groceries</Text>
          <Pressable style={styles.sortBtn}>
            <Text style={styles.sortText}>Sort & filter ⇅</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {filtered.map((p) => (
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
  title: { fontFamily: fonts.serifBold, fontSize: 34, color: colors.ink, marginTop: 2 },
  searchCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: { marginBottom: spacing.lg },
  banner: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.harvest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    minHeight: 190,
  },
  bannerTag: {
    backgroundColor: colors.forest,
    borderRadius: radii.sm,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bannerTagText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  bannerTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.forest, lineHeight: 30, maxWidth: 220 },
  bannerLink: { fontSize: 14, fontWeight: '800', color: colors.forest, marginTop: spacing.md, textDecorationLine: 'underline' },
  bannerImage: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    width: 96,
    height: 96,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '4deg' }],
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink },
  sortBtn: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
  },
  sortText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  gridItem: { width: '47%' },
});
