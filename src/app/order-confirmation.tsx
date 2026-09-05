import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function OrderConfirmation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId, itemCount } = useLocalSearchParams<{ orderId?: string; itemCount?: string }>();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.xxl }]}>
      <Text style={[styles.sparkle, styles.sparkleLeft]}>✦</Text>
      <Text style={[styles.sparkle, styles.sparkleRight]}>✦</Text>
      <View style={styles.checkOuter}>
        <View style={styles.checkInner}>
          <Ionicons name="checkmark" size={40} color={colors.white} />
        </View>
      </View>

      <Text style={styles.orderId}>ORDER {orderId ?? '—'}</Text>
      <Text style={styles.title}>Your groceries{'\n'}are on their way.</Text>
      <Text style={styles.subtitle}>
        We&apos;ll deliver today between 10:00 and 11:00. You can follow every step from the farm to
        your door.
      </Text>

      <View style={styles.card}>
        <Text style={{ fontSize: 26 }}>🚲</Text>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.cardTitle}>Arriving today</Text>
          <Text style={styles.cardSubtitle}>10:00 – 11:00</Text>
        </View>
        <Text style={styles.cardItems}>{itemCount ?? '0'} items</Text>
      </View>

      <Button
        label="Track my order"
        arrow
        onPress={() => router.push('/tracking')}
        style={{ marginTop: spacing.xl, width: '100%' }}
      />
      <Button
        label="Back to home"
        variant="ghost"
        onPress={() => router.replace('/home')}
        style={{ marginTop: spacing.sm }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.gold, alignItems: 'center', paddingHorizontal: spacing.xl },
  sparkle: { position: 'absolute', top: 90, fontSize: 22, color: colors.coral },
  sparkleLeft: { left: 40 },
  sparkleRight: { right: 40, color: colors.white },
  checkOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(30,74,59,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  orderId: { fontSize: 12, fontWeight: '800', color: colors.coral, letterSpacing: 1, marginTop: spacing.lg },
  title: { fontFamily: fonts.serifBold, fontSize: 34, color: colors.ink, textAlign: 'center', marginTop: spacing.sm, lineHeight: 38 },
  subtitle: { fontSize: 14, color: colors.forestDark, textAlign: 'center', marginTop: spacing.md, lineHeight: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.xl,
    width: '100%',
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  cardSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  cardItems: { fontSize: 13, color: colors.muted },
});
