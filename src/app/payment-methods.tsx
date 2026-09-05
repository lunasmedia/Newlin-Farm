import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ListRow } from '@/components/ui/ListRow';
import { colors, radii, spacing } from '@/theme/tokens';

export default function PaymentMethods() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Safe and simple checkout" title="Payment methods" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Text style={styles.empty}>No saved payment methods yet — checkout supports Apple Pay today.</Text>

        <View style={styles.menu}>
          <ListRow icon="card-outline" title="Add a payment card" subtitle="Coming soon" chevron={false} />
          <View style={styles.divider} />
          <ListRow icon="logo-apple" title="Apple Pay" subtitle="Available at checkout" chevron={false} />
          <View style={styles.divider} />
          <ListRow icon="flash-outline" title="Gift card or voucher" subtitle="Coming soon" chevron={false} />
        </View>

        <Text style={styles.footnote}>🔒 Payments are encrypted and securely stored.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 14, color: colors.muted, textAlign: 'center', marginBottom: spacing.lg },
  menu: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  footnote: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.lg },
});
