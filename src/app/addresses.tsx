import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { addresses } from '@/data/user';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

export default function Addresses() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Where should we bring it?" title="Delivery addresses" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Pressable style={styles.addBtn}>
          <Ionicons name="add" size={16} color={colors.forest} />
          <Text style={styles.addBtnText}>Add a new address</Text>
        </Pressable>

        {addresses.map((a) => (
          <View key={a.id} style={[styles.card, a.isDefault && styles.cardActive]}>
            <View style={styles.iconWrap}>
              <Ionicons name={a.icon} size={20} color={colors.forest} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{a.label}</Text>
              <Text style={styles.line}>{a.line1}</Text>
              <Text style={styles.line}>{a.line2}</Text>
              {a.isDefault ? <Text style={styles.defaultTag}>Default address</Text> : null}
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.ink} />
          </View>
        ))}

        <View style={styles.mapCard}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={[styles.stripe, { left: -80 + i * 60 }]} />
          ))}
          <View style={styles.mapPin}>
            <Ionicons name="location" size={20} color={colors.white} />
          </View>
          <View style={styles.areaBadge}>
            <Text style={styles.areaBadgeText}>Delivery area</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.forest,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    backgroundColor: colors.sage,
    marginBottom: spacing.lg,
  },
  addBtnText: { fontSize: 15, fontWeight: '800', color: colors.forest },
  card: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardActive: { borderColor: colors.forest, backgroundColor: colors.sage },
  iconWrap: { width: 48, height: 48, borderRadius: radii.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.ink },
  line: { fontSize: 13, color: colors.muted, marginTop: 2 },
  defaultTag: { fontSize: 12, fontWeight: '800', color: colors.forest, marginTop: spacing.xs },
  mapCard: {
    height: 180,
    borderRadius: radii.xl,
    backgroundColor: '#E4E0D2',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  stripe: { position: 'absolute', width: 2, height: 400, backgroundColor: '#D6D1BF', transform: [{ rotate: '20deg' }] },
  mapPin: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  areaBadge: { position: 'absolute', left: spacing.md, bottom: spacing.md, backgroundColor: colors.white, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: spacing.sm },
  areaBadgeText: { fontSize: 12, fontWeight: '800', color: colors.ink },
});
