import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { colors, radii, spacing } from '@/theme/tokens';

export default function Notifications() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [backInSeason, setBackInSeason] = useState(true);
  const [weeklyOffers, setWeeklyOffers] = useState(false);
  const [fieldNotes, setFieldNotes] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Choose what you hear about" title="Notifications" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.preview}>
          <View style={styles.previewIcon}>
            <Text style={{ fontSize: 22 }}>🍓</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>Strawberry season is here</Text>
            <Text style={styles.previewSubtitle}>Your saved British strawberries are back.</Text>
            <Text style={styles.previewMeta}>NEWLIN FARM · NOW</Text>
          </View>
        </View>

        <View style={styles.card}>
          <ToggleRow title="Order updates" subtitle="Picking, substitutions and delivery" value={orderUpdates} onValueChange={setOrderUpdates} />
          <View style={styles.divider} />
          <ToggleRow title="Back in season" subtitle="Saved products and availability" value={backInSeason} onValueChange={setBackInSeason} />
          <View style={styles.divider} />
          <ToggleRow title="Weekly offers" subtitle="Fresh deals every Thursday" value={weeklyOffers} onValueChange={setWeeklyOffers} />
          <View style={styles.divider} />
          <ToggleRow title="Field Notes" subtitle="Points and reward reminders" value={fieldNotes} onValueChange={setFieldNotes} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  previewIcon: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  previewSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  previewMeta: { fontSize: 10, color: colors.mutedLight, marginTop: 6, fontWeight: '700', letterSpacing: 0.5 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
