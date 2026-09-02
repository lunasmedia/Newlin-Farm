import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconCircle } from '@/components/ui/IconCircle';
import { ListRow } from '@/components/ui/ListRow';
import { user } from '@/data/user';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

const WAYS_TO_EARN = [
  { emoji: '🛒', title: 'Shop the farm', subtitle: '1 point for every £1' },
  { emoji: '🔄', title: 'Return your bags', subtitle: '50 points per collection' },
  { emoji: '💚', title: 'Rescue a Wonky Box', subtitle: 'Double points this week' },
];

export default function Rewards() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = user.points / (user.points + user.pointsToNextReward);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTopRow}>
          <IconCircle name="chevron-back" onPress={() => router.back()} background="rgba(255,255,255,0.15)" color={colors.white} />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerEyebrow}>Good food gives back</Text>
            <Text style={styles.headerTitle}>Field Notes</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.ringOuter}>
          <View style={styles.ring}>
            <Text style={styles.ringValue}>{user.points.toLocaleString()}</Text>
            <Text style={styles.ringLabel}>points</Text>
          </View>
        </View>

        <Text style={styles.untilText}>{user.pointsToNextReward} points until your next</Text>
        <Text style={styles.rewardText}>£{user.rewardValue} Newlin reward</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>£{user.rewardValue}</Text>
            <Text style={styles.statTitle}>Available reward</Text>
            <Text style={styles.statSubtitle}>Use at checkout</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2×</Text>
            <Text style={styles.statTitle}>Points boost</Text>
            <Text style={styles.statSubtitle}>On fresh produce</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ways to earn</Text>
        <View style={styles.card}>
          {WAYS_TO_EARN.map((w, i) => (
            <React.Fragment key={w.title}>
              <ListRow emoji={w.emoji} title={w.title} subtitle={w.subtitle} />
              {i < WAYS_TO_EARN.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.forest,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerEyebrow: { color: '#CFE0D6', fontSize: 12 },
  headerTitle: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.white, marginTop: 2 },
  ringOuter: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  ring: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 6,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: { fontFamily: fonts.serifBold, fontSize: 40, color: colors.white },
  ringLabel: { fontSize: 13, color: colors.gold, marginTop: 2 },
  untilText: { color: '#CFE0D6', fontSize: 14, marginTop: spacing.lg },
  rewardText: { fontFamily: fonts.serifBold, fontSize: 20, color: colors.gold, marginTop: 2 },
  progressTrack: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, alignItems: 'center', padding: spacing.lg },
  statValue: { fontFamily: fonts.serifBold, fontSize: 30, color: colors.coral },
  statTitle: { fontSize: 14, fontWeight: '800', color: colors.ink, marginTop: spacing.xs },
  statSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
