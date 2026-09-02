import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Logo } from '@/components/ui/LogoMark';
import { AuthBadge } from '@/components/ui/AuthBadge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing details', 'Complete your name, email address and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password is too short', 'Use at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      router.replace('/home');
    } catch (error: any) {
      const message = error?.code === 'auth/email-already-in-use'
        ? 'An account already exists for this email.'
        : 'We could not create your account. Please try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenHeader right={<Logo size={16} />} />
      <View style={styles.body}>
        <AuthBadge />
        <Text style={styles.eyebrow}>JOIN THE FARM</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Save favourites, collect Field Notes points and check out faster.
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <Input label="Full name" placeholder="Your name" value={name} onChangeText={setName} />
          <Input
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            showToggle
          />
        </View>

        <Button
          label="Create account"
          arrow
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: spacing.sm }}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          {['G', '', 'f'].map((s, i) => (
            <View key={i} style={styles.socialBtn}>
              <Text style={styles.socialText}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already with us? </Text>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { color: colors.coral, fontWeight: '800', fontSize: 12, letterSpacing: 1, marginTop: spacing.lg },
  title: { fontFamily: fonts.serifBold, fontSize: 32, color: colors.ink, marginTop: spacing.xs },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: spacing.xs },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.muted },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginTop: spacing.lg },
  socialBtn: {
    width: 64,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { fontSize: 18, fontWeight: '800', color: colors.ink },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, paddingBottom: spacing.xl },
  footerText: { fontSize: 14, color: colors.muted },
  footerLink: { fontSize: 14, fontWeight: '800', color: colors.forest },
});
