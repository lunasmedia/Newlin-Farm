import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { Logo } from '@/components/ui/LogoMark';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { useCheckout } from '@/state/checkout-context';
import { useBasket } from '@/state/basket-context';
import { useAddresses } from '@/state/addresses-context';
import { useAuth } from '@/state/auth-context';
import { useOrders } from '@/state/orders-context';
import { useCatalog } from '@/state/catalog-context';
import { placeOrder as placeOrderRequest, SuspendedAccountError } from '@/lib/newlin-api';
import { AccountSuspendedModal } from '@/components/account/AccountSuspendedModal';
import { normalizeStoreSettings } from '@/utils/store-settings';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function CheckoutReview() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slot, paymentId } = useCheckout();
  const { products, totalCount, subtotal, clear } = useBasket();
  const { defaultAddress } = useAddresses();
  const { user: firebaseUser } = useAuth();
  const { refresh: refreshOrders } = useOrders();
  const { settings } = useCatalog();
  const [placing, setPlacing] = useState(false);
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const paymentLabel = paymentId === 'apple-pay' ? 'Apple Pay' : 'Card payment';
  const { freeDeliveryThresholdPence } = normalizeStoreSettings(settings);
  // Meeting the free-delivery threshold waives whatever the chosen slot
  // would otherwise cost — same "free delivery over £X, any slot" model as
  // basket.tsx's estimate, applied here for real once a slot is picked.
  const freeDelivery = subtotal * 100 >= freeDeliveryThresholdPence;
  const deliveryFeePence = freeDelivery ? 0 : slot.feePence;
  const deliveryFee = deliveryFeePence / 100;
  const grandTotal = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (!defaultAddress) {
      Alert.alert('Add a delivery address', 'Choose a delivery address before placing your order.');
      return;
    }
    if (!firebaseUser) {
      Alert.alert('Sign in required', 'Sign in to place an order.');
      return;
    }
    const { minimumOrderPence } = normalizeStoreSettings(settings);
    if (Math.round(subtotal * 100) < minimumOrderPence) {
      Alert.alert(
        'Minimum order not met',
        `Add more to your basket to reach the £${(minimumOrderPence / 100).toFixed(2)} minimum order.`
      );
      return;
    }

    setPlacing(true);
    try {
      // Real ID token — the admin verifies it and derives the customer's
      // identity from that (see lib/customer-auth.ts on the admin side)
      // rather than trusting a client-supplied email, so this order can't
      // be forged as someone else's.
      const idToken = await firebaseUser.getIdToken();
      const result = await placeOrderRequest(idToken, {
        customerName: firebaseUser.displayName?.trim(),
        itemCount: totalCount,
        itemsPence: Math.round(subtotal * 100),
        deliveryFeePence,
        deliveryAddress: `${defaultAddress.line1}, ${defaultAddress.line2}`,
        items: products.map((product) => ({
          productId: product.id,
          name: product.name,
          quantity: product.qty,
          unitPricePence: Math.round(product.price * 100),
        })),
      });
      clear();
      // Fire-and-forget — the orders list refetches in the background so
      // it's already current by the time the user gets to the Orders tab,
      // rather than still showing yesterday's snapshot from app launch.
      void refreshOrders();
      router.replace({ pathname: '/order-confirmation', params: { orderId: result.id, itemCount: String(totalCount) } });
    } catch (error) {
      if (error instanceof SuspendedAccountError) {
        setShowSuspendedModal(true);
      } else {
        Alert.alert('Could not place order', error instanceof Error ? error.message : 'Please try again.');
      }
    } finally {
      setPlacing(false);
    }
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
          {defaultAddress ? `${defaultAddress.line1}, ${defaultAddress.line2}` : 'No delivery address set'}
        </Text>
        <Divider style={{ marginVertical: spacing.lg }} />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Pressable onPress={() => router.push('/checkout/payment')}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionBold}>{paymentLabel}</Text>
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
            <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}</Text>
          </View>
          <Divider style={{ marginVertical: spacing.xs }} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>£{grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Button
          label={`Place order · £${grandTotal.toFixed(2)}`}
          arrow
          onPress={placeOrder}
          loading={placing}
          disabled={placing}
          testID="place-order-button"
        />
      </View>

      <AccountSuspendedModal
        visible={showSuspendedModal}
        onDismiss={() => setShowSuspendedModal(false)}
        onContactSupport={() => {
          setShowSuspendedModal(false);
          router.push('/help');
        }}
      />
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
