import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ListRow } from '@/components/ui/ListRow';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

const ROWS = [
  { emoji: '🥬', title: 'Dietary preferences', subtitle: 'Vegetarian, vegan and free-from' },
  { emoji: '↔️', title: 'Substitution rules', subtitle: 'Smart swaps are on' },
  { emoji: '◐', title: 'Accessibility', subtitle: 'Text size, contrast and motion' },
  { emoji: '👤', title: 'Privacy & data', subtitle: 'Permissions and personal data' },
];

export default function Preferences() {
  const [lowStock, setLowStock] = useState(true);
  const [faceId, setFaceId] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Make Newlin yours" title="Preferences" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.callout}>
          <Text style={{ fontSize: 28 }}>🌱</Text>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.calloutTitle}>Your shopping preferences</Text>
            <Text style={styles.calloutSubtitle}>
              We'll use these to personalise products and substitutions.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {ROWS.map((r, i) => (
            <React.Fragment key={r.title}>
              <ListRow emoji={r.emoji} title={r.title} subtitle={r.subtitle} onPress={() => {}} />
              {i < ROWS.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>

        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <ToggleRow title="Low stock alerts" subtitle="For saved favourites" value={lowStock} onValueChange={setLowStock} />
          <View style={styles.divider} />
          <ToggleRow title="Face ID for checkout" subtitle="Faster, secure payments" value={faceId} onValueChange={setFaceId} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sage,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  calloutTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  calloutSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
