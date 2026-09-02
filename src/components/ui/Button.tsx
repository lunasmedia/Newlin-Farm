import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'chip-active';

export function Button({
  label,
  onPress,
  variant = 'primary',
  arrow = false,
  style,
  disabled,
  loading,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  arrow?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !disabled && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.forest} />
      ) : (
        <>
          <Text
            style={[
              styles.label,
              variant === 'primary' && styles.labelPrimary,
              variant === 'secondary' && styles.labelSecondary,
              variant === 'ghost' && styles.labelGhost,
            ]}>
            {label}
          </Text>
          {arrow && (
            <Ionicons
              name="arrow-forward"
              size={18}
              color={variant === 'primary' ? colors.white : colors.forest}
              style={{ marginLeft: spacing.xs }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
  },
  primary: { backgroundColor: colors.forest },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.forest },
  ghost: { backgroundColor: 'transparent', paddingVertical: spacing.xs },
  label: { fontSize: 16, fontWeight: '700' },
  labelPrimary: { color: colors.white },
  labelSecondary: { color: colors.forest },
  labelGhost: { color: colors.forest, textDecorationLine: 'underline' },
});
