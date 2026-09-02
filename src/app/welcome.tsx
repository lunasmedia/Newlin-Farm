import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Logo } from '@/components/ui/LogoMark';
import { Button } from '@/components/ui/Button';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <Image
        source={require('@/assets/farm/welcome-hero.png')}
        style={styles.hero}
        resizeMode="cover"
      />
      <View style={[styles.pill, { top: insets.top + spacing.md }]}>
        <Logo size={18} />
      </View>
      <View style={styles.tag}>
        <View style={styles.tagFrom}>
          <Text style={styles.tagFromText}>FROM FIELD</Text>
        </View>
        <Text style={styles.tagMain}>to your table</Text>
        <Text style={styles.tagSub}>Fresh every day</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>HELLO, NEIGHBOUR</Text>
        <Text style={styles.title}>Good food starts close to home.</Text>
        <Text style={styles.body}>
          Seasonal groceries, local favourites and everyday essentials, picked with care.
        </Text>
        <Button
          label="Let's get started"
          arrow
          onPress={() => router.push('/onboarding')}
          style={{ marginTop: spacing.lg }}
        />
        <Button
          label="I already have an account"
          variant="ghost"
          onPress={() => router.push('/sign-in')}
          style={{ marginTop: spacing.sm, alignSelf: 'center' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.harvest },
  hero: { width: '100%', height: '58%' },
  pill: {
    position: 'absolute',
    left: spacing.lg,
    backgroundColor: colors.cream,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tag: { position: 'absolute', top: '20%', left: spacing.lg },
  tagFrom: {
    backgroundColor: colors.forest,
    borderRadius: radii.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  tagFromText: { color: colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  tagMain: {
    fontFamily: fonts.serifBold,
    fontStyle: 'italic',
    fontSize: 34,
    color: colors.coral,
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
  },
  tagSub: { fontSize: 15, color: colors.forestDark, marginTop: 4, fontWeight: '600' },
  card: {
    flex: 1,
    backgroundColor: colors.cream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: spacing.xl,
  },
  eyebrow: { color: colors.coral, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  title: { fontFamily: fonts.serifBold, fontSize: 34, color: colors.ink, marginTop: spacing.xs, lineHeight: 40 },
  body: { fontSize: 15, color: colors.muted, marginTop: spacing.sm, lineHeight: 21 },
});
