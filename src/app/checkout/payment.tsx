import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IconCircle } from '@/components/ui/IconCircle';
import { Logo } from '@/components/ui/LogoMark';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { useCheckout } from '@/state/checkout-context';
import { loyalty } from '@/data/user';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function CheckoutPayment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { paymentId, setPaymentId, useFieldNotes, setUseFieldNotes } = useCheckout();
  const [billingSame, setBillingSame] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <Logo size={16} />
        <Text style={styles.secure}>Secure</Text>
      </View>
      <View style={styles.steps}>
        <ProgressSteps steps={['Delivery', 'Payment', 'Review']} currentIndex={1} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
        <Text style={styles.eyebrow}>STEP 2 OF 3</Text>
        <Text style={styles.title}>How would you like to pay?</Text>
        <Text style={styles.subtitle}>Payments are encrypted and securely processed.</Text>

        {/* Not selectable — a saved card means real card data (PAN/expiry)
            with no payment processor behind it, so this stays a visual
            placeholder rather than a working option. */}
        <View style={[styles.optionRow, styles.optionRowDisabled]}>
          <View style={styles.optionIcon}>
            <Ionicons name="card" size={18} color={colors.mutedLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, styles.optionTitleDisabled]}>Card payment</Text>
            <Text style={styles.optionSubtitle}>Coming soon</Text>
          </View>
        </View>

        <Pressable
          onPress={() => setPaymentId('apple-pay')}
          style={[styles.optionRow, paymentId === 'apple-pay' && styles.optionRowActive]}>
          <View style={styles.optionIcon}>
            <Ionicons name="logo-apple" size={18} color={colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Apple Pay</Text>
            <Text style={styles.optionSubtitle}>Pay instantly</Text>
          </View>
          <View style={paymentId === 'apple-pay' ? styles.checkCircle : styles.radio}>
            {paymentId === 'apple-pay' ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
          </View>
        </Pressable>

        <Pressable style={styles.checkboxRow} onPress={() => setBillingSame((v) => !v)}>
          <View style={[styles.checkbox, billingSame && styles.checkboxOn]}>
            {billingSame ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>Billing address is the same as delivery</Text>
        </Pressable>

        {/* Only appears once there's a real points balance to redeem — no
            fabricated "you have 500 points" here. */}
        {loyalty.points > 0 ? (
          <View style={styles.fieldNotes}>
            <View style={styles.optionIcon}>
              <Ionicons name="leaf" size={18} color={colors.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Use {loyalty.points} Field Notes</Text>
              <Text style={styles.optionSubtitle}>Take £{loyalty.rewardValue.toFixed(2)} off this order</Text>
            </View>
            <Pressable
              onPress={() => setUseFieldNotes(!useFieldNotes)}
              style={[styles.toggle, useFieldNotes && styles.toggleOn]}>
              <View style={[styles.toggleThumb, useFieldNotes && styles.toggleThumbOn]} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button label="Continue" arrow onPress={() => router.push('/checkout/review')} />
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
  subtitle: { fontSize: 14, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.lg },
  optionRow: {
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
  optionRowActive: { borderColor: colors.forest, backgroundColor: colors.sage },
  optionRowDisabled: { opacity: 0.55 },
  optionIcon: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: '#EDF1E4', alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  optionTitleDisabled: { color: colors.muted },
  optionSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border },
  checkCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  checkboxLabel: { fontSize: 14, color: colors.ink },
  fieldNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: '#D8D2C1', padding: 3 },
  toggleOn: { backgroundColor: colors.forest },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
  toggleThumbOn: { marginLeft: 18 },
  footer: { backgroundColor: colors.cream, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, padding: spacing.lg, position: 'absolute', left: 0, right: 0, bottom: 0 },
});
