import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { ProductCard } from '@/components/ui/ProductCard';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

const POPULAR = ['Strawberries', 'Sourdough', 'Milk', 'Offers', 'Dinner tonight'];

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Newlin Farm"
            placeholderTextColor={colors.mutedLight}
            style={styles.input}
            autoFocus
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
        {query.trim().length === 0 ? (
          <>
            <Text style={styles.sectionLabel}>POPULAR SEARCHES</Text>
            <View style={styles.popularWrap}>
              {POPULAR.map((term) => (
                <Pressable key={term} style={styles.popularChip} onPress={() => setQuery(term)}>
                  <Ionicons name="arrow-up-outline" size={13} color={colors.ink} style={{ transform: [{ rotate: '45deg' }] }} />
                  <Text style={styles.popularText}>{term}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.browseTitle}>Browse categories</Text>
            <View style={styles.categoryList}>
              {categories.map((c) => (
                <Pressable
                  key={c.slug}
                  style={styles.categoryRow}
                  onPress={() => router.push(`/shop?category=${c.slug}`)}>
                  <View style={[styles.categoryIcon, { backgroundColor: c.backdrop }]}>
                    <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
                  </View>
                  <Text style={styles.categoryName}>{c.name}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{results.length} results</Text>
              <Pressable style={styles.sortBtn}>
                <Text style={styles.sortText}>Filter ⇅</Text>
              </Pressable>
            </View>
            <View style={styles.grid}>
              {results.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <ProductCard product={p} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.inputBg,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 0.5, marginTop: spacing.md, marginBottom: spacing.sm },
  popularWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  popularText: { fontSize: 14, color: colors.ink, fontWeight: '600' },
  browseTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  categoryList: { gap: spacing.sm },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryIcon: { width: 48, height: 48, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  categoryName: { flex: 1, fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm, marginBottom: spacing.md },
  resultsCount: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink },
  sortBtn: { backgroundColor: colors.inputBg, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  sortText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridItem: { width: '47%' },
});
