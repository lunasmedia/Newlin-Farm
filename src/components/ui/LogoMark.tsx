import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export function LogoMark({ size = 32, light = false }: { size?: number; light?: boolean }) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: light ? colors.white : colors.forest,
        },
      ]}>
      <Text style={{ fontSize: size * 0.5 }}>🍃</Text>
      <View
        style={[
          styles.leaf,
          { backgroundColor: colors.gold, width: size * 0.28, height: size * 0.28, top: -size * 0.06, right: -size * 0.04 },
        ]}
      />
    </View>
  );
}

export function Wordmark({ size = 22, light = false }: { size?: number; light?: boolean }) {
  return (
    <Text style={{ fontFamily: fonts.serifBold, fontSize: size }}>
      <Text style={{ color: light ? colors.white : colors.forest }}>newlin</Text>
      <Text style={{ color: colors.coral }}>farm</Text>
    </Text>
  );
}

export function Logo({ size = 22, light = false }: { size?: number; light?: boolean }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size + 10} light={light} />
      <Wordmark size={size} light={light} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  leaf: { position: 'absolute', borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
