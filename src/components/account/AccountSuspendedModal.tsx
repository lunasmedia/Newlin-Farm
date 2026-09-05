import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { fonts } from '@/theme/fonts';
import { colors, radii, shadow, spacing } from '@/theme/tokens';

type AccountSuspendedModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onContactSupport: () => void;
};

// Same sheet/reveal-animation shape as AddedToBasketModal, recoloured for a
// warning rather than a success — the two are visually distinct enough at a
// glance (coral vs. forest/green) not to be confused with each other.
export function AccountSuspendedModal({ visible, onDismiss, onContactSupport }: AccountSuspendedModalProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // useState (not useRef().current) so this stays outside the
  // react-hooks/refs "no ref reads during render" rule — a state
  // initializer still only constructs the Animated.Value once.
  const [reveal] = useState(() => new Animated.Value(0));
  const stackActions = width < 350;

  useEffect(() => {
    if (!visible) {
      reveal.setValue(0);
      return;
    }

    Animated.spring(reveal, {
      toValue: 1,
      damping: 19,
      stiffness: 210,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [reveal, visible]);

  const translateY = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [42, 0],
  });

  const actionButtonStyle = StyleSheet.flatten([
    styles.actionButton,
    stackActions && styles.stackedButton,
  ]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close account suspended dialog"
          onPress={onDismiss}
        />

        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, spacing.md),
              opacity: reveal,
              transform: [{ translateY }],
            },
          ]}>
          <View style={styles.handle} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
            onPress={onDismiss}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <Ionicons name="close" size={22} color={colors.muted} />
          </Pressable>

          <View style={styles.banner}>
            <View style={styles.icon}>
              <Ionicons name="lock-closed" size={22} color={colors.white} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.eyebrow}>ACCOUNT RESTRICTED</Text>
              <Text style={styles.heading}>Your account is suspended</Text>
            </View>
          </View>

          <Text style={styles.body}>
            You can still browse and view your order history, but placing new orders has been
            paused on this account. If you think this is a mistake, get in touch and we&apos;ll
            sort it out.
          </Text>

          <View style={[styles.actions, stackActions && styles.actionsStacked]}>
            <Button
              label="Dismiss"
              variant="secondary"
              onPress={onDismiss}
              style={actionButtonStyle}
              testID="account-suspended-dismiss"
            />
            <Button
              label="Contact support"
              arrow
              onPress={onContactSupport}
              style={actionButtonStyle}
              testID="account-suspended-contact-support"
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(19, 33, 26, 0.42)',
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: colors.creamCard,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  handle: {
    width: 46,
    height: 5,
    alignSelf: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    zIndex: 2,
    top: spacing.xl,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
  },
  pressed: { opacity: 0.72 },
  banner: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.blush,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: 60,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  copy: { flex: 1 },
  eyebrow: {
    color: colors.coral,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  heading: {
    color: colors.forest,
    fontFamily: fonts.serifBold,
    fontSize: 22,
    lineHeight: 27,
  },
  body: {
    color: colors.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionsStacked: { flexDirection: 'column-reverse' },
  actionButton: {
    flex: 1,
    minHeight: 58,
    paddingHorizontal: spacing.sm,
  },
  stackedButton: { flex: 0, width: '100%' },
});
