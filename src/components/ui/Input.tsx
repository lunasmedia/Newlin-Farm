import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

export function Input({
  label,
  showToggle,
  ...props
}: TextInputProps & { label?: string; showToggle?: boolean }) {
  const [hidden, setHidden] = useState(!!showToggle);
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <TextInput
          placeholderTextColor={colors.mutedLight}
          secureTextEntry={showToggle ? hidden : props.secureTextEntry}
          style={styles.input}
          {...props}
        />
        {showToggle ? (
          <Pressable onPress={() => setHidden((h) => !h)} style={styles.toggle}>
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
  },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: colors.ink },
  toggle: { paddingLeft: spacing.sm },
  toggleText: { color: colors.forest, fontWeight: '700', fontSize: 14 },
});
