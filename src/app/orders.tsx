import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppShell } from '@/components/layout/AppShell';
import { AppRefreshControl } from '@/components/ui/AppRefreshControl';
import { IconCircle } from '@/components/ui/IconCircle';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { NewlinImage } from '@/components/media/NewlinImage';
import { productImageKey, productImagePlaceholder, productImageSource } from '@/lib/product-image';
import { useOrders, Order } from '@/state/orders-context';
import { useCatalog } from '@/state/catalog-context';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

// The order record only stores an item count and total, not which specific
// products were bought — there's no line-item table yet — so past-order
// rows use two catalogue images as decoration, not a claim about contents.
const PROGRESS_STEPS = ['Confirmed', 'Packing', 'Out for delivery', 'Delivered'];

function formatOrderDate(iso: string) {
  const normalised = iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z';
  return new Date(normalised).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export default function Orders() {
  const router = useRouter();
  const [tab, setTab] = useState<'progress' | 'past'>('progress');
  const { currentOrder, pastOrders, loading, refresh } = useOrders();
  const { products } = useCatalog();

  return (
    <AppShell>
      <View style={{ flex: 1 }}>
        {/* Fixed in place — pull-to-refresh only affects the card/list area
            below, which has its own ScrollView. Reached by a push from
            Account's menu (see account.tsx) — there's no tab-bar entry for
            this screen (the tab bar treats Orders as part of the Account
            tab — see TabBar.tsx), so ScreenHeader's back button is the only
            in-app way back besides that tab. */}
        <ScreenHeader
          eyebrow="Track your delivery"
          title="Orders"
          backTestID="orders-back-button"
          right={<IconCircle name="search" iconSize={18} onPress={() => router.push('/search')} testID="orders-search-button" />}
        />

        <SegmentedControl
          style={styles.segment}
          value={tab}
          onChange={setTab}
          options={[
            { label: 'In progress', value: 'progress', testID: 'orders-tab-progress' },
            { label: 'Past orders', value: 'past', testID: 'orders-tab-past' },
          ]}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={tab === 'progress' ? styles.progressScrollContent : { paddingBottom: spacing.xxl }}
          refreshControl={<AppRefreshControl onRefresh={refresh} />}>
          {tab === 'progress' ? (
            loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptySubtitle}>Loading…</Text>
              </View>
            ) : currentOrder ? (
              <ProgressCard order={currentOrder} onTrack={() => router.push('/tracking')} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 32 }}>📦</Text>
                <Text style={styles.emptyTitle}>No orders in progress</Text>
                <Text style={styles.emptySubtitle}>Once you place an order, track it here.</Text>
              </View>
            )
          ) : (
            <>
              <View style={styles.prevHeader}>
                <Text style={styles.prevTitle}>Previous orders</Text>
              </View>

              {loading ? null : pastOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={{ fontSize: 32 }}>🧺</Text>
                  <Text style={styles.emptyTitle}>No past orders yet</Text>
                  <Text style={styles.emptySubtitle}>Your order history will show up here.</Text>
                </View>
              ) : (
                pastOrders.map((o, idx) => {
                  const p1 = products[idx % products.length];
                  const p2 = products[(idx + 1) % products.length];
                  return (
                    <View key={o.id} style={styles.pastRow}>
                      {p1 && p2 ? (
                        <View style={styles.pastThumbWrap}>
                          <NewlinImage
                            visible
                            source={productImageSource(p1, 'card')}
                            placeholder={productImagePlaceholder(p1)}
                            imageKey={productImageKey(p1, 'card')}
                            style={[styles.pastThumb, { left: 0 }]}
                            contentFit="cover"
                          />
                          <NewlinImage
                            visible
                            source={productImageSource(p2, 'card')}
                            placeholder={productImagePlaceholder(p2)}
                            imageKey={productImageKey(p2, 'card')}
                            style={[styles.pastThumb, { left: 18 }]}
                            contentFit="cover"
                          />
                        </View>
                      ) : null}
                      <View style={{ flex: 1, marginLeft: spacing.lg }}>
                        <Text style={styles.pastDate}>{formatOrderDate(o.createdAt)}</Text>
                        <Text style={styles.pastMeta}>
                          {o.itemCount} items · £{(o.totalPence / 100).toFixed(2)}
                        </Text>
                        <Text style={styles.pastStatus}>{o.status}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}
        </ScrollView>
      </View>
    </AppShell>
  );
}

function ProgressCard({ order, onTrack }: { order: Order; onTrack: () => void }) {
  const stepIndex = PROGRESS_STEPS.indexOf(order.status);
  const cancelled = order.status === 'Cancelled';
  // Nothing to actually track on a map until the order has left the farm —
  // earlier statuses (Confirmed/Packing) have no driver en route yet.
  const trackable = order.status === 'Out for delivery';

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressTop}>
        <Text style={styles.progressStatus}>{order.status.toUpperCase()}</Text>
        <Text style={styles.progressId}>{order.id}</Text>
      </View>
      <Text style={{ fontSize: 48, textAlign: 'center', marginTop: spacing.md }}>
        {cancelled ? '✕' : '🚲'}
      </Text>
      <Text style={styles.progressEta}>
        {cancelled ? 'Order cancelled' : order.eta ? `Arriving by ${order.eta}` : 'We’ll confirm a time soon'}
      </Text>
      {order.driver ? (
        <Text style={styles.progressDriver}>Your driver, {order.driver}, has your order.</Text>
      ) : null}

      {!cancelled ? (
        <View style={styles.timelineRow}>
          {PROGRESS_STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <View style={styles.timelineStep}>
                <View style={[styles.timelineDot, i <= stepIndex && styles.timelineDotOn]}>
                  <Text style={styles.timelineDotText}>{i < stepIndex ? '✓' : i + 1}</Text>
                </View>
                <Text style={styles.timelineLabel}>{label}</Text>
              </View>
              {i < PROGRESS_STEPS.length - 1 ? <View style={styles.timelineConnector} /> : null}
            </React.Fragment>
          ))}
        </View>
      ) : null}

      {!cancelled ? (
        <Pressable
          style={[styles.trackBtn, !trackable && styles.trackBtnDisabled]}
          onPress={onTrack}
          disabled={!trackable}
          testID="track-live-button">
          <Text style={[styles.trackBtnText, !trackable && styles.trackBtnTextDisabled]}>
            {trackable ? 'Track live →' : 'Track live once it’s out for delivery'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyTitle: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink, marginTop: spacing.sm },
  emptySubtitle: { fontSize: 13, color: colors.muted, marginTop: 2, textAlign: 'center' },
  segment: { marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.lg },
  // flexGrow so the pull-to-refresh gesture (and the empty state) has room
  // to work even when the card/empty-state content is shorter than the
  // screen — a ScrollView with under-height content still supports pull,
  // but centring the empty state needs the extra flex space either way.
  progressScrollContent: { flexGrow: 1, paddingBottom: spacing.xxl },
  progressCard: { backgroundColor: colors.forest, marginHorizontal: spacing.lg, borderRadius: radii.xl, padding: spacing.lg },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStatus: { color: colors.gold, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  progressId: { color: colors.white, fontSize: 13, fontWeight: '700' },
  progressEta: { fontFamily: fonts.serifBold, fontSize: 28, color: colors.white, textAlign: 'center', marginTop: spacing.sm },
  progressDriver: { fontSize: 13, color: '#CFE0D6', textAlign: 'center', marginTop: spacing.xs, paddingHorizontal: spacing.md },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  timelineStep: { alignItems: 'center', width: 60 },
  timelineDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  timelineDotOn: { backgroundColor: colors.gold },
  timelineDotText: { fontSize: 12, fontWeight: '800', color: colors.forest },
  timelineLabel: { fontSize: 10, color: '#CFE0D6', marginTop: 4, textAlign: 'center' },
  timelineConnector: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: -14 },
  trackBtn: { backgroundColor: colors.gold, borderRadius: radii.pill, alignItems: 'center', paddingVertical: 16, marginTop: spacing.lg },
  trackBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  trackBtnText: { color: colors.forest, fontWeight: '800', fontSize: 16 },
  trackBtnTextDisabled: { color: '#CFE0D6', fontSize: 13 },
  prevHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  prevTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink },
  pastRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  pastThumbWrap: { width: 84, height: 56 },
  pastThumb: { position: 'absolute', width: 56, height: 56, borderRadius: radii.md, borderWidth: 2, borderColor: colors.cream },
  pastDate: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  pastMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  pastStatus: { fontSize: 12, fontWeight: '800', color: colors.forest, marginTop: 2 },
});
