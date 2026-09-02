import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ListRow } from '@/components/ui/ListRow';
import { paymentMethods, user } from '@/data/user';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function PaymentMethods() {
  const card = paymentMethods[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Safe and simple checkout" title="Payment methods" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.card}>
          <Text style={styles.cardWordmark}>
            newlin<Text style={{ color: colors.gold }}>farm</Text>
          </Text>
          <Text style={styles.cardNumber}>•••• {card.label.slice(-4)}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardName}>{user.name.toUpperCase()}</Text>
            <Text style={styles.cardExpiry}>{card.expiry.replace('Expires ', '')}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <ListRow icon="card-outline" title="Add a payment card" subtitle="Credit or debit card" onPress={() => {}} />
          <View style={styles.divider} />
          <ListRow
            icon="logo-apple"
            title="Apple Pay"
            subtitle="Connected"
            chevron={false}
            right={<Ionicons name="checkmark" size={18} color={colors.ink} />}
          />
          <View style={styles.divider} />
          <ListRow icon="flash-outline" title="Gift card or voucher" subtitle="Add a balance" onPress={() => {}} />
        </View>

        <Text style={styles.footnote}>🔒 Payments are encrypted and securely stored.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.forest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    height: 190,
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardWordmark: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.white },
  cardNumber: { color: colors.white, fontSize: 16, letterSpacing: 2, alignSelf: 'flex-end' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { color: colors.white, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  cardExpiry: { color: colors.white, fontSize: 13, fontWeight: '700' },
  menu: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  footnote: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.lg },
});
