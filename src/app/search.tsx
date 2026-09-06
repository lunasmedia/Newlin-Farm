import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { ProductCard } from '@/components/ui/ProductCard';
import { recordSearch } from '@/lib/newlin-api';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { useAuth } from '@/state/auth-context';
import { useCatalog } from '@/state/catalog-context';

// How long to wait after the last keystroke before this counts as a real
// search worth recording — avoids logging "s", "st", "str", ... as the
// customer types, while still catching a search they never technically
// "submit" (there's no separate submit step in this UI).
const RECORD_SEARCH_DEBOUNCE_MS = 700;
const MIN_RECORDED_QUERY_LENGTH = 2;

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products, categories, popularSearches } = useCatalog();
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_RECORDED_QUERY_LENGTH) return;
    const timeout = setTimeout(() => {
      // Signed-in searches are attributed (via a fresh ID token) so the
      // admin can tell whether this search later led to a purchase — see
      // recordSearch. A token fetch failure still records the search, just
      // anonymously, same as being signed out.
      if (user) {
        user
          .getIdToken()
          .then((idToken) => recordSearch(trimmed, idToken))
          .catch(() => recordSearch(trimmed));
      } else {
        recordSearch(trimmed);
      }
    }, RECORD_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query, user]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.longDescription?.toLowerCase().includes(q) ?? false) ||
        (p.badge?.toLowerCase().includes(q) ?? false)
    );
  }, [query, products]);

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
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
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
            {popularSearches.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>POPULAR SEARCHES</Text>
                <View style={styles.popularWrap}>
                  {popularSearches.map((term) => (
                    <Pressable key={term} style={styles.popularChip} onPress={() => setQuery(term)}>
                      <Ionicons name="arrow-up-outline" size={13} color={colors.ink} style={{ transform: [{ rotate: '45deg' }] }} />
                      <Text style={styles.popularText}>{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}

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
            {results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 32 }}>🔍</Text>
                <Text style={styles.emptyTitle}>No matches for &quot;{query.trim()}&quot;</Text>
                <Text style={styles.emptySubtitle}>Try a different word, or browse a category below.</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {results.map((p) => (
                  <View key={p.id} style={styles.gridItem}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            )}
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
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg, gap: spacing.xs },
  emptyTitle: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  gridItem: { width: '47%' },
});
