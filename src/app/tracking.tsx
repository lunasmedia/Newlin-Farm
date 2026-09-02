import React from 'react';
import { View, Text, Pressable, Linking, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { currentOrder } from '@/data/orders';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function Tracking() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.eta}>Arriving by {currentOrder.eta}</Text>
          <Text style={styles.orderId}>Order {currentOrder.id}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

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
          <Text style={styles.etaPillText}>{currentOrder.driver} is {currentOrder.minutesAway} minutes away</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitials}>MM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>{currentOrder.driver} is your driver</Text>
            <Text style={styles.driverMeta}>Electric delivery bike · 4.9 ★</Text>
          </View>
          <Pressable style={styles.callBtn} onPress={() => Linking.openURL('tel:+441234567890')}>
            <Ionicons name="call" size={18} color={colors.forest} />
          </Pressable>
        </View>

        <View style={styles.timeline}>
          {currentOrder.timeline.map((step, i) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, (step.done || step.active) && styles.dotOn]}>
                  <Text style={[styles.dotText, (step.done || step.active) && styles.dotTextOn]}>
                    {step.done ? '✓' : i + 1}
                  </Text>
                </View>
                {i < currentOrder.timeline.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={{ paddingBottom: spacing.lg }}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepTime}>{step.time}</Text>
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
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  timeline: { marginTop: spacing.xl },
  timelineRow: { flexDirection: 'row', gap: spacing.sm },
  timelineLeft: { alignItems: 'center', width: 32 },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E4DFCE', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.forest },
  dotText: { fontSize: 12, fontWeight: '800', color: colors.muted },
  dotTextOn: { color: colors.white },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  stepLabel: { fontSize: 17, fontWeight: '800', color: colors.ink },
  stepTime: { fontSize: 13, color: colors.muted, marginTop: 2 },
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
