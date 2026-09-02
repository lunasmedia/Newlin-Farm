import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar } from './TabBar';
import { colors } from '@/theme/tokens';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>{children}</View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
});
