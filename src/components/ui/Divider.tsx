import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

export function Divider({ style }: { style?: object }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: '100%' },
});
