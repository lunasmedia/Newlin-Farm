import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '@/theme/tokens';

export function Badge({
  label,
  tone = 'light',
}: {
  label: string;
  tone?: 'light' | 'forest';
}) {
  return (
    <View style={[styles.badge, tone === 'forest' ? styles.forest : styles.light]}>
      <Text style={[styles.text, tone === 'forest' ? styles.textLight : styles.textDark]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  light: { backgroundColor: colors.white },
  forest: { backgroundColor: colors.forest },
  text: { fontSize: 12, fontWeight: '700' },
  textDark: { color: colors.forest },
  textLight: { color: colors.white },
});
