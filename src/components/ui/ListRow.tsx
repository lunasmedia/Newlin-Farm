import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/theme/tokens';

export function ListRow({
  icon,
  emoji,
  title,
  subtitle,
  onPress,
  chevron = true,
  right,
  testID,
}: {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  emoji?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  chevron?: boolean;
  right?: React.ReactNode;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [styles.row, pressed && onPress && { opacity: 0.6 }]}>
      {icon || emoji ? (
        <View style={styles.iconWrap}>
          {emoji ? (
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
          ) : (
            <Ionicons name={icon!} size={20} color={colors.forest} />
          )}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
      {chevron && onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: '#EDF1E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
