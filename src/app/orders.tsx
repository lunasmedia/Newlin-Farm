import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppShell } from '@/components/layout/AppShell';
import { currentOrder, pastOrders } from '@/data/orders';
import { products } from '@/data/products';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function Orders() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'progress' | 'past'>('progress');

  return (
    <AppShell>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.topRow, { paddingTop: insets.top + spacing.sm }]}>
          <View>
            <Text style={styles.eyebrow}>YOUR SHOPPING</Text>
            <Text style={styles.title}>Orders</Text>
          </View>
          <Pressable style={styles.searchCircle} onPress={() => router.push('/search')}>
            <Ionicons name="search" size={18} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentBtn, tab === 'progress' && styles.segmentBtnActive]}
            onPress={() => setTab('progress')}>
            <Text style={[styles.segmentText, tab === 'progress' && styles.segmentTextActive]}>
              In progress
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segmentBtn, tab === 'past' && styles.segmentBtnActive]}
            onPress={() => setTab('past')}>
            <Text style={[styles.segmentText, tab === 'past' && styles.segmentTextActive]}>
              Past orders
            </Text>
          </Pressable>
        </View>

        {tab === 'progress' ? (
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressStatus}>OUT FOR DELIVERY</Text>
              <Text style={styles.progressId}>{currentOrder.id}</Text>
            </View>
            <Text style={{ fontSize: 48, textAlign: 'center', marginTop: spacing.md }}>🚲</Text>
            <Text style={styles.progressEta}>Arriving by {currentOrder.eta}</Text>
            <Text style={styles.progressDriver}>
              Your driver, {currentOrder.driver}, has left the farm with your order.
            </Text>

            <View style={styles.timelineRow}>
              {currentOrder.timeline.map((step, i) => (
                <React.Fragment key={step.label}>
                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, (step.done || step.active) && styles.timelineDotOn]}>
                      <Text style={styles.timelineDotText}>{step.done ? '✓' : i + 1}</Text>
                    </View>
                    <Text style={styles.timelineLabel}>{step.label}</Text>
                  </View>
                  {i < currentOrder.timeline.length - 1 ? <View style={styles.timelineConnector} /> : null}
                </React.Fragment>
              ))}
            </View>

            <Pressable style={styles.trackBtn} onPress={() => router.push('/tracking')}>
              <Text style={styles.trackBtnText}>Track live →</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.prevHeader}>
          <Text style={styles.prevTitle}>Previous orders</Text>
          <View style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View all</Text>
          </View>
        </View>

        {pastOrders.map((o, idx) => {
          const p1 = products[idx % products.length];
          const p2 = products[(idx + 1) % products.length];
          return (
            <View key={o.id} style={styles.pastRow}>
              <View style={styles.pastThumbWrap}>
                <Image source={p1.image} style={[styles.pastThumb, { left: 0 }]} />
                <Image source={p2.image} style={[styles.pastThumb, { left: 18 }]} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.lg }}>
                <Text style={styles.pastDate}>{o.date}</Text>
                <Text style={styles.pastMeta}>
                  {o.items} items · £{o.total.toFixed(2)}
                </Text>
                <Text style={styles.pastStatus}>{o.status}</Text>
              </View>
              <Pressable style={styles.reorderBtn}>
                <Text style={styles.reorderText}>Reorder</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  eyebrow: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 0.5 },
  title: { fontFamily: fonts.serifBold, fontSize: 32, color: colors.ink, marginTop: 2 },
  searchCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  segment: { flexDirection: 'row', backgroundColor: colors.inputBg, borderRadius: radii.pill, marginHorizontal: spacing.lg, padding: 4, marginBottom: spacing.lg },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: radii.pill },
  segmentBtnActive: { backgroundColor: colors.white },
  segmentText: { fontSize: 14, fontWeight: '700', color: colors.muted },
  segmentTextActive: { color: colors.ink },
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
  trackBtnText: { color: colors.forest, fontWeight: '800', fontSize: 16 },
  prevHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  prevTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink },
  viewAllBtn: { backgroundColor: colors.inputBg, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  viewAllText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  pastRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  pastThumbWrap: { width: 84, height: 56 },
  pastThumb: { position: 'absolute', width: 56, height: 56, borderRadius: radii.md, borderWidth: 2, borderColor: colors.cream },
  pastDate: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  pastMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  pastStatus: { fontSize: 12, fontWeight: '800', color: colors.forest, marginTop: 2 },
  reorderBtn: { backgroundColor: colors.sage, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  reorderText: { fontSize: 13, fontWeight: '800', color: colors.forest },
});
