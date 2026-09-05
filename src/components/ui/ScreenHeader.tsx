import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from './IconCircle';
import { colors, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export function ScreenHeader({
  eyebrow,
  title,
  onBack,
  right,
  showBack = true,
  backTestID,
}: {
  eyebrow?: string;
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showBack?: boolean;
  backTestID?: string;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {showBack ? (
          <IconCircle name="chevron-back" onPress={onBack ?? (() => router.back())} testID={backTestID} />
        ) : (
          <View style={{ width: 44 }} />
        )}
        <View style={styles.titleWrap}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
        <View style={styles.right}>{right ?? <View style={{ width: 44 }} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, backgroundColor: colors.cream },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flex: 1, alignItems: 'center' },
  right: { alignItems: 'flex-end' },
  eyebrow: { fontSize: 12, color: colors.muted, marginBottom: 2 },
  title: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.ink },
});
