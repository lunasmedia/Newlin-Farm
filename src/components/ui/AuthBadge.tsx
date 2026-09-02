import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '@/theme/tokens';

export function AuthBadge() {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <Text style={styles.emoji}>🍎</Text>
      </View>
      <View style={styles.tag}>
        <Text style={styles.tagText}>fresh start</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 44 },
  tag: {
    position: 'absolute',
    right: -18,
    bottom: 14,
    backgroundColor: colors.coral,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    transform: [{ rotate: '-6deg' }],
  },
  tagText: { color: colors.white, fontSize: 11, fontStyle: 'italic', fontWeight: '600' },
});
