import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppShell } from '@/components/layout/AppShell';
import { Wordmark } from '@/components/ui/LogoMark';
import { ListRow } from '@/components/ui/ListRow';
import { AccountSuspendedModal } from '@/components/account/AccountSuspendedModal';
import { loyalty } from '@/data/user';
import { useAuth } from '@/state/auth-context';
import { useFavourites } from '@/state/favourites-context';
import { useOrders } from '@/state/orders-context';
import { getTimeOfDayGreeting } from '@/utils/format-date';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NF';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const MENU = [
  { icon: 'reader-outline' as const, title: 'Orders', subtitle: 'Track, reorder or view receipts', route: '/orders' },
  { icon: 'home-outline' as const, title: 'Delivery addresses', subtitle: 'Home and collection locations', route: '/addresses' },
  { icon: 'diamond-outline' as const, title: 'Payment methods', subtitle: 'Cards, Apple Pay and vouchers', route: '/payment-methods' },
  { icon: 'notifications-outline' as const, title: 'Notifications', subtitle: 'Offers, orders and availability', route: '/notifications' },
  { icon: 'settings-outline' as const, title: 'Preferences', subtitle: 'Dietary, privacy and accessibility', route: '/preferences' },
  { icon: 'help-circle-outline' as const, title: 'Help & support', subtitle: 'FAQs and contact options', route: '/help' },
];

export default function Account() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: firebaseUser, suspended } = useAuth();
  const { favourites } = useFavourites();
  const { orders } = useOrders();
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  // Surfaces a suspension the moment the profile is opened, rather than the
  // customer only discovering it when an order they try to place fails
  // (see checkout/review.tsx for that other trigger point). Adjusted during
  // render rather than in an effect (React's documented alternative:
  // https://react.dev/learn/you-might-not-need-an-effect) — fires exactly
  // once per `suspended` transition, so dismissing the modal doesn't get
  // immediately overridden by an unrelated re-render while still suspended.
  const [suspendedShownFor, setSuspendedShownFor] = useState(false);
  if (suspended !== suspendedShownFor) {
    setSuspendedShownFor(suspended);
    if (suspended) setShowSuspendedModal(true);
  }

  // Generic fallback (not a fake person) while auth state is still
  // resolving, or if this screen is ever reached without a signed-in user.
  const displayName =
    firebaseUser?.displayName?.trim() || firebaseUser?.email?.split('@')[0] || 'Newlin shopper';
  const initials = getInitials(displayName);
  const orderCount = orders.length;

  return (
    <AppShell>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.headerTopRow}>
            <Wordmark size={22} light />
            <Pressable style={styles.gearBtn} onPress={() => router.push('/preferences')}>
              <Ionicons name="settings-outline" size={18} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.profileRow}>
            <Pressable
              style={styles.avatarWrap}
              onPress={() => suspended && setShowSuspendedModal(true)}
              testID="account-profile-icon">
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              {firebaseUser ? (
                <View style={styles.checkBadge}>
                  <Ionicons name={suspended ? 'lock-closed' : 'checkmark'} size={11} color={colors.white} />
                </View>
              ) : null}
            </Pressable>
            <View>
              <Text style={styles.greeting}>{getTimeOfDayGreeting()}</Text>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.editProfile}>Edit profile</Text>
            </View>
          </View>

          <Pressable style={styles.rewardsBanner} onPress={() => router.push('/rewards')}>
            <Text style={{ fontSize: 22 }}>🌾</Text>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.rewardsEyebrow}>FIELD NOTES</Text>
              <Text style={styles.rewardsPoints}>{loyalty.points.toLocaleString()} points</Text>
              <Text style={styles.rewardsSubtitle}>
                {loyalty.points > 0
                  ? `${loyalty.pointsToNextReward} points to your next £${loyalty.rewardValue} reward`
                  : 'Earn points on every order'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.forest} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <Pressable style={styles.statCard} onPress={() => router.push('/orders')}>
            <Text style={styles.statValue}>{orderCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </Pressable>
          <Pressable style={styles.statCard} onPress={() => router.push('/saved')}>
            <Text style={styles.statValue}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Pressable>
          <Pressable style={styles.statCard} onPress={() => router.push('/rewards')}>
            <Text style={styles.statValue}>£{loyalty.rewardValue}</Text>
            <Text style={styles.statLabel}>Rewards</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>MY ACCOUNT</Text>
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <React.Fragment key={item.route}>
              <ListRow
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => router.push(item.route as any)}
                testID={`account-menu-${item.route.slice(1)}`}
              />
              {i < MENU.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      <AccountSuspendedModal
        visible={showSuspendedModal}
        onDismiss={() => setShowSuspendedModal(false)}
        onContactSupport={() => {
          setShowSuspendedModal(false);
          router.push('/help');
        }}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.forest,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  avatarWrap: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800', color: colors.forest },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.coral,
    borderWidth: 2,
    borderColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { color: '#CFE0D6', fontSize: 13 },
  name: { fontFamily: fonts.serifBold, fontSize: 26, color: colors.white, marginTop: 2 },
  editProfile: { color: colors.gold, fontWeight: '700', fontSize: 13, marginTop: 4 },
  rewardsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  rewardsEyebrow: { fontSize: 11, fontWeight: '800', color: colors.forest, letterSpacing: 0.5 },
  rewardsPoints: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.forest, marginTop: 2 },
  rewardsSubtitle: { fontSize: 12, color: colors.forestDark, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: -spacing.lg, gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.ink },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: colors.muted, letterSpacing: 0.5, marginHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
