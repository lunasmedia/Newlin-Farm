import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from '@/theme/tokens';

export function QuantityStepper({
  value,
  onChange,
  vertical = false,
}: {
  value: number;
  onChange: (next: number) => void;
  vertical?: boolean;
}) {
  return (
    <View style={[styles.wrap, vertical ? styles.vertical : styles.horizontal]}>
      <Pressable
        onPress={() => onChange(Math.max(0, value - 1))}
        style={styles.btn}
        hitSlop={8}>
        <Ionicons name="remove" size={16} color={colors.forest} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable onPress={() => onChange(value + 1)} style={styles.btn} hitSlop={8}>
        <Ionicons name="add" size={16} color={colors.forest} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  horizontal: { flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 6, gap: 14 },
  vertical: { flexDirection: 'column', paddingVertical: 10, paddingHorizontal: 6, gap: 10 },
  btn: { alignItems: 'center', justifyContent: 'center', width: 24, height: 24 },
  value: { fontSize: 15, fontWeight: '700', color: colors.ink, minWidth: 16, textAlign: 'center' },
});
