import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing, shadow } from '@/theme/tokens';

export function Card({
  children,
  style,
  padded = true,
  elevated = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        padded && { padding: spacing.md },
        elevated && shadow.card,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
