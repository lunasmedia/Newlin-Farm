import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

export function ProgressSteps({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <View style={styles.row}>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <View style={styles.stepWrap}>
            <View
              style={[
                styles.dot,
                i < currentIndex && styles.dotDone,
                i === currentIndex && styles.dotActive,
              ]}>
              {i < currentIndex ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : (
                <Text style={[styles.dotText, i === currentIndex && { color: colors.white }]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.label, i <= currentIndex && styles.labelActive]}>{step}</Text>
          </View>
          {i < steps.length - 1 ? (
            <View style={[styles.connector, i < currentIndex && styles.connectorDone]} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  stepWrap: { alignItems: 'center', width: 76 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E4DFCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dotDone: { backgroundColor: colors.forest },
  dotActive: { backgroundColor: colors.forest },
  dotText: { fontSize: 13, fontWeight: '700', color: colors.muted },
  label: { fontSize: 12, fontWeight: '700', color: colors.mutedLight },
  labelActive: { color: colors.forest },
  connector: { height: 2, backgroundColor: '#E4DFCE', flex: 1, marginTop: 15, maxWidth: 60 },
  connectorDone: { backgroundColor: colors.forest },
});
