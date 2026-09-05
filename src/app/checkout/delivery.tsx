import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IconCircle } from '@/components/ui/IconCircle';
import { Logo } from '@/components/ui/LogoMark';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { useCheckout } from '@/state/checkout-context';
import { useAddresses } from '@/state/addresses-context';
import { useCatalog } from '@/state/catalog-context';
import { getUpcomingDeliveryDays } from '@/utils/format-date';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

function formatFee(feePence: number) {
  return feePence === 0 ? 'FREE' : `£${(feePence / 100).toFixed(2)}`;
}

export default function CheckoutDelivery() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slot, setSlot } = useCheckout();
  const { defaultAddress } = useAddresses();
  const { deliverySlots } = useCatalog();
  // Computed once per visit to this screen, not a fixed range — recomputes
  // against "now" each time so it never goes stale.
  const DAYS = useMemo(() => getUpcomingDeliveryDays(4), []);
  const [day, setDay] = useState(DAYS[0]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <Logo size={16} />
        <Text style={styles.secure}>Secure</Text>
      </View>
      <View style={styles.steps}>
        <ProgressSteps steps={['Delivery', 'Payment', 'Review']} currentIndex={0} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
        <Text style={styles.eyebrow}>STEP 1 OF 3</Text>
        <Text style={styles.title}>When should we arrive?</Text>
        <Text style={styles.subtitle}>Choose a one-hour delivery window for today.</Text>

        {defaultAddress ? (
          <View style={styles.addressCard}>
            <View style={styles.addressIcon}>
              <Ionicons name="home" size={18} color={colors.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>{defaultAddress.label}</Text>
              <Text style={styles.addressLine}>{defaultAddress.line1}</Text>
              <Text style={styles.addressLine}>{defaultAddress.line2}</Text>
            </View>
            <Pressable onPress={() => router.push('/addresses')}>
              <Text style={styles.change}>Change</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addAddressCard} onPress={() => router.push('/add-address')}>
            <View style={styles.addressIcon}>
              <Ionicons name="add" size={18} color={colors.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Add a delivery address</Text>
              <Text style={styles.addressLine}>Needed before we can schedule a delivery</Text>
            </View>
          </Pressable>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
          {DAYS.map((d) => {
            const active = d.day === day.day;
            return (
              <Pressable
                key={d.day}
                onPress={() => setDay(d)}
                style={[styles.dayChip, active && styles.dayChipActive]}>
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{d.day}</Text>
                <Text style={[styles.dayDate, active && styles.dayLabelActive]}>{d.date}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.slotsTitle}>Available slots</Text>
        {deliverySlots.length === 0 ? (
          <Text style={styles.subtitle}>No delivery slots are available right now.</Text>
        ) : null}
        {deliverySlots.map((s) => {
          const active = slot.time === s.time;
          return (
            <Pressable
              key={s.id}
              onPress={() => setSlot({ day: day.day, date: day.date, time: s.time, feePence: s.feePence })}
              style={[styles.slotRow, active && styles.slotRowActive]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.slotTime}>{s.time}</Text>
                {s.subtitle ? <Text style={styles.slotSubtitle}>{s.subtitle}</Text> : null}
              </View>
              <Text style={styles.slotPrice}>{formatFee(s.feePence)}</Text>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button
          label="Continue"
          arrow
          disabled={!defaultAddress}
          onPress={() => router.push('/checkout/payment')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  secure: { fontSize: 13, color: colors.muted, width: 44, textAlign: 'right' },
  steps: { paddingVertical: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  eyebrow: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 0.5 },
  title: { fontFamily: fonts.serifBold, fontSize: 32, color: colors.ink, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: spacing.xs },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.white,
  },
  addAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.forest,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.sage,
  },
  addressIcon: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  addressLabel: { fontSize: 16, fontWeight: '800', color: colors.ink },
  addressLine: { fontSize: 13, color: colors.muted },
  change: { fontSize: 14, fontWeight: '800', color: colors.forest },
  dayChip: {
    width: 90,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  dayChipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  dayLabel: { fontSize: 15, fontWeight: '800', color: colors.ink },
  dayDate: { fontSize: 12, color: colors.muted, marginTop: 2 },
  dayLabelActive: { color: colors.white },
  slotsTitle: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  slotRowActive: { borderColor: colors.forest, backgroundColor: colors.sage },
  slotTime: { fontSize: 17, fontWeight: '800', color: colors.ink },
  slotSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  slotPrice: { fontSize: 14, fontWeight: '800', color: colors.ink },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.forest },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.forest },
  footer: { backgroundColor: colors.cream, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, padding: spacing.lg, position: 'absolute', left: 0, right: 0, bottom: 0 },
});
