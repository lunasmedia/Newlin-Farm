import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.inactive]}>
      {icon}
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    marginRight: spacing.xs,
  },
  active: { backgroundColor: colors.forest },
  inactive: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 14, fontWeight: '700' },
  labelActive: { color: colors.white },
  labelInactive: { color: colors.ink },
});
