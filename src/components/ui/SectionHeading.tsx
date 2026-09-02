import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export function SectionHeading({
  eyebrow,
  title,
  onSeeAll,
}: {
  eyebrow?: string;
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} style={styles.seeAll}>
          <Text style={styles.seeAllText}>See all</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.forest} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  eyebrow: { fontSize: 12, fontWeight: '700', color: colors.coral, letterSpacing: 0.5, marginBottom: 4 },
  title: { fontFamily: fonts.serifBold, fontSize: 28, color: colors.ink },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingBottom: 6 },
  seeAllText: { fontSize: 14, fontWeight: '700', color: colors.forest },
});
