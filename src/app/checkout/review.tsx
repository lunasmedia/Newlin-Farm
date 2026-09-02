import React from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { Logo } from '@/components/ui/LogoMark';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { useCheckout } from '@/state/checkout-context';
import { useBasket } from '@/state/basket-context';
import { addresses, paymentMethods } from '@/data/user';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function CheckoutReview() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slot } = useCheckout();
  const { products, totalCount, subtotal, clear } = useBasket();
  const home = addresses[0];
  const card = paymentMethods[0];

  const placeOrder = () => {
    clear();
    router.replace('/order-confirmation');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconCircle name="chevron-back" onPress={() => router.back()} />
        <Logo size={16} />
        <Text style={styles.secure}>Secure</Text>
      </View>
      <View style={styles.steps}>
        <ProgressSteps steps={['Delivery', 'Payment', 'Review']} currentIndex={2} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
        <Text style={styles.eyebrow}>FINAL STEP</Text>
        <Text style={styles.title}>Review your order</Text>
        <Text style={styles.subtitle}>One last look before we start picking.</Text>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          <Pressable onPress={() => router.push('/checkout/delivery')}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionBold}>
          {slot.day}, {slot.time}
        </Text>
        <Text style={styles.sectionMuted}>
          {home.line1}, {home.line2}
        </Text>
        <Divider style={{ marginVertical: spacing.lg }} />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Pressable onPress={() => router.push('/checkout/payment')}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionBold}>{card.label}</Text>
        <Text style={styles.sectionMuted}>Billing address matches delivery</Text>
        <Divider style={{ marginVertical: spacing.lg }} />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{totalCount} items</Text>
          <Pressable onPress={() => router.push('/basket')}>
            <Text style={styles.edit}>Edit basket</Text>
          </Pressable>
        </View>
        <View style={styles.thumbRow}>
          {products.map((p) => (
            <Image key={p.id} source={p.image} style={styles.thumb} />
          ))}
        </View>
        <Divider style={{ marginTop: spacing.lg }} />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Groceries</Text>
            <Text style={styles.summaryValue}>£{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>{slot.price}</Text>
          </View>
          <Divider style={{ marginVertical: spacing.xs }} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>£{subtotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button label={`Place order · £${subtotal.toFixed(2)}`} arrow onPress={placeOrder} />
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
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.ink },
  edit: { fontSize: 14, fontWeight: '800', color: colors.forest },
  sectionBold: { fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: spacing.sm },
  sectionMuted: { fontSize: 13, color: colors.muted, marginTop: 2 },
  thumbRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  thumb: { width: 64, height: 64, borderRadius: radii.md },
  summary: { backgroundColor: colors.inputBg, borderRadius: radii.lg, padding: spacing.md, marginTop: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  summaryLabel: { fontSize: 14, color: colors.body },
  summaryValue: { fontSize: 14, fontWeight: '700', color: colors.ink },
  summaryLabelBold: { fontSize: 17, fontWeight: '800', color: colors.ink },
  summaryValueBold: { fontSize: 17, fontWeight: '800', color: colors.ink },
  footer: { backgroundColor: colors.cream, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, padding: spacing.lg, position: 'absolute', left: 0, right: 0, bottom: 0 },
});
