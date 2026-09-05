import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { useOrders } from '@/state/orders-context';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

// Same status list as orders.tsx's progress card — kept in sync there
// rather than shared, since this is the only other place it's used.
const PROGRESS_STEPS = ['Confirmed', 'Packing', 'Out for delivery', 'Delivered'];

export default function Tracking() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentOrder } = useOrders();
  // Captured locally so TS narrows it through the JSX closures below —
  // narrowing an imported const doesn't reliably persist into callbacks.
  const order = currentOrder;

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <IconCircle name="chevron-back" onPress={() => router.back()} />
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 32 }}>📦</Text>
          <Text style={styles.emptyTitle}>Nothing to track right now</Text>
        </View>
      </View>
    );
  }

  const stepIndex = PROGRESS_STEPS.indexOf(order.status);
  const driverInitials = order.driver
    ? order.driver.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()
    : '–';

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.eta}>{order.eta ? `Arriving by ${order.eta}` : order.status}</Text>
          <Text style={styles.orderId}>Order {order.id}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Schematic, not a real live map — there's no GPS tracking behind
          this app, only an order status. */}
      <View style={styles.map}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.stripe, { left: -100 + i * 90 }]} />
        ))}
        <View style={[styles.pin, styles.pinFarm]}>
          <Text style={{ fontSize: 18 }}>🌾</Text>
        </View>
        <View style={[styles.pin, styles.pinDriver]}>
          <Text style={{ fontSize: 18 }}>🚲</Text>
        </View>
        <View style={[styles.pin, styles.pinHome]}>
          <Ionicons name="home" size={18} color={colors.white} />
        </View>
        <View style={styles.etaPill}>
          <Text style={styles.etaPillText}>{order.status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {order.driver ? (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitials}>{driverInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{order.driver} is your driver</Text>
              <Text style={styles.driverMeta}>Electric delivery bike</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.timeline}>
          {PROGRESS_STEPS.map((label, i) => (
            <View key={label} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, i <= stepIndex && styles.dotOn]}>
                  <Text style={[styles.dotText, i <= stepIndex && styles.dotTextOn]}>
                    {i < stepIndex ? '✓' : i + 1}
                  </Text>
                </View>
                {i < PROGRESS_STEPS.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={{ paddingBottom: spacing.lg }}>
                <Text style={styles.stepLabel}>{label}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.helpRow} onPress={() => router.push('/help')}>
          <Text style={styles.helpText}>Need help with this order?</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.ink} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyTitle: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.ink },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  eta: { fontSize: 13, color: colors.muted },
  orderId: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.ink },
  map: {
    height: 260,
    backgroundColor: '#E4E0D2',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: { position: 'absolute', width: 2, height: 500, backgroundColor: '#D6D1BF', transform: [{ rotate: '35deg' }] },
  pin: { position: 'absolute', width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  pinFarm: { backgroundColor: colors.gold, top: 30, left: 40 },
  pinDriver: { backgroundColor: colors.forest, top: 110, left: '46%' },
  pinHome: { backgroundColor: colors.coral, bottom: 40, right: 50 },
  etaPill: { position: 'absolute', bottom: 20, backgroundColor: colors.white, borderRadius: radii.pill, paddingVertical: 10, paddingHorizontal: spacing.md },
  etaPillText: { fontSize: 13, fontWeight: '800', color: colors.ink },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  driverInitials: { color: colors.white, fontWeight: '800' },
  driverName: { fontSize: 16, fontWeight: '800', color: colors.ink },
  driverMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  timeline: { marginTop: spacing.xl },
  timelineRow: { flexDirection: 'row', gap: spacing.sm },
  timelineLeft: { alignItems: 'center', width: 32 },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E4DFCE', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.forest },
  dotText: { fontSize: 12, fontWeight: '800', color: colors.muted },
  dotTextOn: { color: colors.white },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  stepLabel: { fontSize: 17, fontWeight: '800', color: colors.ink },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  helpText: { fontSize: 15, fontWeight: '800', color: colors.ink },
});
