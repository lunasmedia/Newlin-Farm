import React, { useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/ui/ProductCard';
import { colors, radii, spacing, shadow } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { useAuth } from '@/state/auth-context';
import { useBasket } from '@/state/basket-context';

// Short, single-word labels for the top nav row only — the full category
// names (used everywhere else) are too long to fit four across one row.
const TOP_NAV_CATEGORIES = [
  { slug: 'fruit-veg', emoji: '🥕', label: 'Fruit' },
  { slug: 'bakery', emoji: '🥖', label: 'Bakery' },
  { slug: 'dairy-eggs', emoji: '🥛', label: 'Dairy' },
  { slug: 'meat-fish', emoji: '🥩', label: 'Meat' },
];

// How much scroll distance the collapse/expand plays out over. Tuned to
// roughly the combined natural height of the nav row + address row.
const COLLAPSE_RANGE = 90;
// Vertical gap between the nav row / search bar / address row, baked into
// the interpolated positions below (see `computeHeaderLayout`).
const HEADER_GAP = spacing.sm;
// How far past the top the user has to pull before releasing triggers a
// refresh. The native RefreshControl spinner can't be used here — it's a
// subview of the ScrollView, so it renders *underneath* the always-on-top
// header overlay and is invisible. Pull progress and the spinner are
// instead driven by hand from the same scrollY value the header already
// uses, and the spinner is rendered inside the header overlay itself so it
// shares its top-most z-order.
const PULL_REFRESH_THRESHOLD = 70;

// All three rows are positioned by directly interpolating their `top` off
// live scroll position — not by animating a sibling's height/margin and
// hoping flexbox reflows the rest in time. That reflow-based approach (an
// earlier version of this) is what caused the hero banner to visibly
// overlap the address row mid-scroll and the search bar to not reliably
// reclaim the nav row's space: Animated-driven layout props don't always
// re-flow flex siblings in sync with the animation, since the animation
// runs frame-by-frame outside React's normal render/layout pass. Absolute
// positioning sidesteps that entirely — every row's position is computed
// directly from scrollY on every frame, with nothing left for layout to
// reflow.
function computeHeaderLayout(
  scrollY: Animated.Value,
  topOffset: number,
  navH: number,
  searchH: number,
  deliverH: number
) {
  const interpolate = (outputRange: [number, number]) =>
    scrollY.interpolate({ inputRange: [0, COLLAPSE_RANGE], outputRange, extrapolate: 'clamp' });

  return {
    // The nav row's position stays fixed (see JSX) — instead its own
    // clipping height shrinks from its natural height down to 0, so it
    // collapses in place (content cut off at the bottom, top edge never
    // moving) rather than translating upward as a rigid block off-screen.
    navRowClipHeight: interpolate([navH, 0]),
    // Moves up to occupy exactly where the nav row used to be.
    searchBarTop: interpolate([topOffset + navH + HEADER_GAP, topOffset]),
    // Ends at the same position as the search bar — literally underneath
    // it (rendered first, so the search bar paints on top).
    deliverRowTop: interpolate([topOffset + navH + HEADER_GAP + searchH + HEADER_GAP, topOffset]),
    // Shrinks the visible/clipped window down to just the search bar, so
    // the ScrollView content underneath is revealed as the nav row and
    // address row move out of the way.
    overlayHeight: interpolate([
      topOffset + navH + HEADER_GAP + searchH + HEADER_GAP + deliverH,
      topOffset + searchH,
    ]),
  };
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: authUser, loading } = useAuth();
  const { totalCount } = useBasket();
  // Extra breathing room below the safe area (status bar / Dynamic Island),
  // not just the bare minimum needed to clear it.
  const headerTopOffset = insets.top + spacing.xl;

  const scrollY = useRef(new Animated.Value(0)).current;
  // Measured on first layout so the collapse is based on each row's real
  // rendered height, not a guessed constant.
  const [navRowHeight, setNavRowHeight] = useState<number | null>(null);
  const [searchBarHeight, setSearchBarHeight] = useState<number | null>(null);
  const [deliverRowHeight, setDeliverRowHeight] = useState<number | null>(null);
  const measured = navRowHeight !== null && searchBarHeight !== null && deliverRowHeight !== null;
  const layout = measured
    ? computeHeaderLayout(scrollY, headerTopOffset, navRowHeight, searchBarHeight, deliverRowHeight)
    : null;
  // Reserves the same amount of space at the top of the scroll content as
  // the fully-expanded header occupies, so the hero banner starts exactly
  // where the address row's bottom edge is — matching the pre-collapse
  // layout — without the ScrollView itself ever needing to resize.
  const expandedHeaderHeight = measured
    ? headerTopOffset + navRowHeight + HEADER_GAP + searchBarHeight + HEADER_GAP + deliverRowHeight
    : headerTopOffset + 220; // generous placeholder for the one frame before measurement

  React.useEffect(() => {
    if (!loading && !authUser) router.replace('/sign-in');
  }, [authUser, loading, router]);

  const [refreshing, setRefreshing] = useState(true);
  // Read from onScrollEndDrag to decide whether the user pulled far enough
  // to release into a refresh — Animated.Value has no synchronous getter.
  const pullDistance = useRef(0);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    // Nothing to actually re-fetch (all data here is static/local) — this
    // just gives the gesture the feedback a real refresh would.
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <AppShell>
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: expandedHeaderHeight, paddingBottom: spacing.xxl }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
            listener: (e: any) => {
              pullDistance.current = -e.nativeEvent.contentOffset.y;
            },
          })}
          onScrollEndDrag={() => {
            if (pullDistance.current >= PULL_REFRESH_THRESHOLD) handleRefresh();
          }}
          scrollEventThrottle={16}>
          <Pressable style={styles.hero} onPress={() => router.push('/shop?category=fruit-veg')}>
          <View style={styles.heroText}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>WEEKEND HARVEST</Text>
            </View>
            <Text style={styles.heroTitle}>Fresh from{'\n'}our fields.</Text>
            <Text style={styles.heroSubtitle}>Save 20% on seasonal fruit and veg.</Text>
            <Text style={styles.heroLink}>Shop the harvest →</Text>
          </View>
          <Image
            source={require('@/assets/farm/hero-bag.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.section}>
          <SectionHeading eyebrow="BROWSE" title="Shop by category" onSeeAll={() => router.push('/shop')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.slice(0, 5).map((cat) => (
              <Pressable
                key={cat.slug}
                style={styles.categoryTile}
                onPress={() => router.push(`/shop?category=${cat.slug}`)}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.backdrop }]}>
                  <Text style={{ fontSize: 34 }}>{cat.emoji}</Text>
                </View>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeading
            eyebrow="FRESH PICKS"
            title="Popular right now"
            onSeeAll={() => router.push('/shop')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.slice(0, 4).map((p) => (
              <View key={p.id} style={{ width: 210, marginRight: spacing.sm }}>
                <ProductCard product={p} width={210} />
              </View>
            ))}
          </ScrollView>
        </View>
        </Animated.ScrollView>

        {/* Layered on top of the ScrollView (not a flex sibling above it) so
            its own animation never needs the ScrollView to resize or
            reposition — that dependency was the root cause of both bugs.
            The ScrollView's content already reserves `expandedHeaderHeight`
            of space up top; this overlay just reveals progressively more of
            it as it shrinks, rather than the content actually moving. */}
        <View style={styles.headerOverlay} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.headerOverlayClip,
              { height: measured ? layout!.overlayHeight : expandedHeaderHeight },
            ]}>
            <Animated.View
              style={[
                { position: 'absolute', left: 0, right: 0, top: headerTopOffset, overflow: 'hidden' },
                measured ? { height: layout!.navRowClipHeight } : undefined,
              ]}>
              <View
                style={styles.navRow}
                onLayout={(e) => {
                  const height = e.nativeEvent.layout.height;
                  setNavRowHeight((h) => h ?? height);
                }}>
                {TOP_NAV_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.slug}
                    style={styles.navItem}
                    onPress={() => router.push(`/shop?category=${cat.slug}`)}>
                    <Text style={styles.navIcon}>{cat.emoji}</Text>
                    <Text style={styles.navLabel}>{cat.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.topRow,
                measured
                  ? { position: 'absolute', left: 0, right: 0, top: layout!.deliverRowTop }
                  : { marginTop: HEADER_GAP },
              ]}
              onLayout={(e) => {
                const height = e.nativeEvent.layout.height;
                setDeliverRowHeight((h) => h ?? height);
              }}>
              <Pressable>
                <Text style={styles.deliverLabel}>Delivering to</Text>
                <View style={styles.deliverRow}>
                  <Text style={styles.deliverValue} numberOfLines={1}>
                    E5 0NP · Clapton
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.ink} />
                </View>
              </Pressable>
              <Pressable
                onPress={() => router.push('/basket')}
                style={styles.avatar}
                testID="basket-header-button">
                <Ionicons name="basket" size={20} color={colors.white} />
                {totalCount > 0 ? (
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>{totalCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.searchBarWrap,
                measured
                  ? { position: 'absolute', left: 0, right: 0, top: layout!.searchBarTop }
                  : { marginTop: HEADER_GAP },
              ]}
              onLayout={(e) => {
                const height = e.nativeEvent.layout.height;
                setSearchBarHeight((h) => h ?? height);
              }}>
              <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
                <Ionicons name="search" size={18} color={colors.muted} />
                <Text style={styles.searchPlaceholder}>Search fruit, bread, milk...</Text>
                <View style={styles.scanBtn}>
                  <Ionicons name="scan-outline" size={16} color={colors.ink} />
                </View>
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Pull-to-refresh spinner. Rendered here — a sibling of the clip,
              not inside it — so it sits above the header content at a fixed
              spot and is untouched by the collapse animation. Its opacity
              tracks the live pull distance while dragging (via scrollY,
              which goes negative on overscroll) so it fades in as the user
              pulls, then locks to fully visible for the duration of the
              simulated refresh once released past the threshold. */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pullRefreshWrap,
              { top: insets.top + spacing.xs },
              {
                opacity: refreshing
                  ? 1
                  : scrollY.interpolate({
                      inputRange: [-PULL_REFRESH_THRESHOLD, 0],
                      outputRange: [1, 0],
                      extrapolate: 'clamp',
                    }),
              },
            ]}>
            <ActivityIndicator color={colors.forest} />
          </Animated.View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  // Spans the full width at the top of the screen; height is set inline
  // (headerOverlayClip) since it's the piece that animates. box-none so
  // taps pass through to the ScrollView once a row has moved out of the
  // way, rather than this full-width wrapper eating them.
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerOverlayClip: { overflow: 'hidden', backgroundColor: colors.cream },
  pullRefreshWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.cream,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 16, fontWeight: '700', color: colors.ink },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    backgroundColor: colors.cream,
  },
  deliverLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  deliverRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  deliverValue: { fontSize: 15, fontWeight: '800', color: colors.ink },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    // Kept inside the avatar's own 40x40 box (no negative offsets) — the
    // header's collapse animation hides this row by sliding the search bar
    // to exactly cover it, and that coverage is only guaranteed within the
    // avatar's bounds. A badge poking outside them used to peek out past
    // the search bar's edge once scrolled.
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.coral,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  avatarBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  searchBarWrap: { paddingHorizontal: spacing.lg, backgroundColor: colors.cream },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    // White, not inputBg (#F4EFE1) — that's nearly the same tone as the
    // cream page background (#FBF6EA), so the bar had almost no contrast
    // to pop against regardless of the shadow.
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    ...shadow.card,
  },
  searchPlaceholder: { flex: 1, color: colors.muted, fontSize: 15 },
  scanBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    // Was white to stand out against the old inputBg fill; now that the
    // bar itself is white, this needs to be the tinted one instead.
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.harvest,
    borderRadius: radii.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 260,
  },
  heroText: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  heroTag: {
    backgroundColor: colors.forest,
    borderRadius: radii.sm,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  heroTagText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontFamily: fonts.serifBold, fontSize: 30, color: colors.forest, lineHeight: 34 },
  heroSubtitle: { fontSize: 13, color: colors.forestDark, marginTop: spacing.xs, maxWidth: 150 },
  heroLink: { fontSize: 14, fontWeight: '800', color: colors.forest, marginTop: spacing.md, textDecorationLine: 'underline' },
  heroImage: { width: '46%', height: '100%' },
  section: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  categoryTile: { alignItems: 'center', marginRight: spacing.lg, width: 74 },
  categoryIcon: {
    width: 68,
    height: 68,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: colors.ink, marginTop: spacing.xs, textAlign: 'center' },
});
