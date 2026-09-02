import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Logo } from '@/components/ui/LogoMark';

const STEPS = [
  {
    bg: colors.blush,
    emoji: '🥬',
    eyebrow: 'SHOP FRESH',
    title: 'The farm shop, in your pocket.',
    body: 'Discover seasonal produce and everyday essentials from trusted local growers.',
    number: '01',
  },
  {
    bg: colors.sage,
    emoji: '🚲',
    eyebrow: 'PICK YOUR TIME',
    title: 'Delivery that fits your day.',
    body: 'Choose a one-hour slot or collect from the farm, with live order updates.',
    number: '02',
  },
  {
    bg: colors.gold,
    emoji: '🌱',
    eyebrow: 'WASTE LESS',
    title: 'Better for your basket and the planet.',
    body: 'Smart substitutions, reusable bags and rescued-produce offers make every shop count.',
    number: '03',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const data = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) router.replace('/sign-in');
    else setStep((s) => s + 1);
  };

  return (
    <View style={[styles.wrap, { backgroundColor: data.bg, paddingTop: insets.top + spacing.md }]}>
      <View style={styles.topRow}>
        <Logo size={18} />
        <Pressable onPress={() => router.replace('/sign-in')}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.illustrationWrap}>
        <View style={styles.circleOuter}>
          <View style={styles.dashRing} />
          <Text style={styles.emoji}>{data.emoji}</Text>
        </View>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{data.number}</Text>
        </View>
        <View style={styles.careBadge}>
          <Text style={styles.careText}>GROWN{'\n'}WITH CARE</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>{data.eyebrow}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.body}>{data.body}</Text>
      </View>

      <View style={[styles.bottomRow, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={next} style={styles.nextBtn}>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { fontSize: 15, fontWeight: '700', color: colors.ink },
  illustrationWrap: { alignItems: 'center', marginTop: spacing.xxl, position: 'relative' },
  circleOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9C2AC',
  },
  emoji: { fontSize: 96 },
  numberBadge: {
    position: 'absolute',
    left: '14%',
    bottom: -8,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { color: colors.white, fontSize: 18, fontWeight: '800' },
  careBadge: {
    position: 'absolute',
    right: '10%',
    bottom: 10,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.forest,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careText: { color: colors.gold, fontSize: 10, fontWeight: '800', textAlign: 'center', lineHeight: 13 },
  content: { marginTop: spacing.xxl },
  eyebrow: { color: colors.coral, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  title: { fontFamily: fonts.serifBold, fontSize: 34, color: colors.ink, marginTop: spacing.xs, lineHeight: 40 },
  body: { fontSize: 15, color: colors.muted, marginTop: spacing.sm, lineHeight: 21 },
  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.18)' },
  dotActive: { width: 24, backgroundColor: colors.forest },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
