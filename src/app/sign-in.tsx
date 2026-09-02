import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { colors, radii, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Logo } from '@/components/ui/LogoMark';
import { AuthBadge } from '@/components/ui/AuthBadge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/home');
    } catch (error: any) {
      const message = error?.code === 'auth/invalid-credential'
        ? 'That email or password is not correct.'
        : 'We could not sign you in. Please try again.';
      Alert.alert('Sign-in failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Add your email address first, then try again.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Check your inbox', 'We sent you a password reset link.');
    } catch {
      Alert.alert('Could not send email', 'Check the email address and try again.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenHeader right={<Logo size={16} />} />
      <View style={styles.body}>
        <AuthBadge />
        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Good to see you again</Text>
        <Text style={styles.subtitle}>Sign in to see your favourites, orders and rewards.</Text>

        <View style={{ marginTop: spacing.lg }}>
          <Input label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Input label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} showToggle />
        </View>

        <View style={styles.row}>
          <Pressable style={styles.rememberRow} onPress={() => setRemember((r) => !r)}>
            <View style={[styles.checkbox, remember && styles.checkboxOn]} />
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>
          <Pressable onPress={handleForgotPassword}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        </View>

        <Button label="Sign in" arrow onPress={handleSignIn} loading={loading} style={{ marginTop: spacing.lg }} />

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
          <Text style={styles.footerText}>New to Newlin Farm? </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.footerLink}>Create account</Text>
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
  subtitle: { fontSize: 15, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border },
  checkboxOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  rememberText: { fontSize: 14, color: colors.ink },
  forgot: { fontSize: 14, fontWeight: '700', color: colors.forest },
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
