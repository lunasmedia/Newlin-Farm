import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Logo } from '@/components/ui/LogoMark';

const { width } = Dimensions.get('window');

export default function Splash() {
  const router = useRouter();

  return (
    <Pressable style={styles.wrap} onPress={() => router.replace('/welcome')}>
      <StatusBar style="light" />
      <View style={styles.circleOuter} pointerEvents="none">
        <View style={styles.circleInner}>
          <Text style={styles.sprout}>🌱</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Logo size={28} light />
        <Text style={styles.tagline}>GOOD FOOD · GOOD ROOTS</Text>
      </View>

      <View style={styles.hill} pointerEvents="none">
        <View style={[styles.rowLine, { transform: [{ rotate: '-14deg' }], left: '30%' }]} />
        <View style={[styles.rowLine, { transform: [{ rotate: '-4deg' }], left: '46%' }]} />
        <View style={[styles.rowLine, { transform: [{ rotate: '4deg' }], left: '54%' }]} />
        <View style={[styles.rowLine, { transform: [{ rotate: '14deg' }], left: '70%' }]} />
      </View>

      <Text style={styles.cta}>Tap anywhere to begin</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.forest, overflow: 'hidden' },
  circleOuter: {
    position: 'absolute',
    top: -width * 0.35,
    right: -width * 0.35,
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: width,
    backgroundColor: '#2E6350',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: width * 0.28,
    paddingLeft: width * 0.05,
  },
  circleInner: {
    width: width * 0.66,
    height: width * 0.66,
    borderRadius: width,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprout: { fontSize: width * 0.16 },
  center: { flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 32 },
  tagline: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.gold,
  },
  hill: {
    position: 'absolute',
    bottom: -width * 0.55,
    left: -width * 0.1,
    width: width * 1.2,
    height: width * 1.1,
    borderRadius: width,
    backgroundColor: '#1A4232',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rowLine: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: '70%',
    backgroundColor: '#4E7C67',
  },
  cta: {
    position: 'absolute',
    bottom: 64,
    alignSelf: 'center',
    fontFamily: fonts.serifSemiBold,
    color: colors.white,
    fontSize: 15,
  },
});
