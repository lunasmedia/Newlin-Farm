import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  type ImageSourcePropType,
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

type AddedToBasketModalProps = {
  visible: boolean;
  productName: string;
  productImage?: ImageSourcePropType;
  productBackdrop?: string;
  quantity?: number;
  onDismiss: () => void;
  onContinueShopping: () => void;
  onGoToBasket: () => void;
};

export function AddedToBasketModal({
  visible,
  productName,
  productImage,
  productBackdrop = colors.inputBg,
  quantity = 1,
  onDismiss,
  onContinueShopping,
  onGoToBasket,
}: AddedToBasketModalProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reveal = useRef(new Animated.Value(0)).current;
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

  const itemLabel = `${quantity} ${quantity === 1 ? 'item' : 'items'} added`;
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
          accessibilityLabel="Close added to basket dialog"
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

          <View style={styles.successBanner}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={22} color={colors.white} />
            </View>
            <View style={styles.successCopy}>
              <Text style={styles.eyebrow}>ORDER UPDATED</Text>
              <Text style={styles.heading}>Added to basket</Text>
            </View>
          </View>

          <View style={styles.productRow}>
            <View style={[styles.imageFrame, { backgroundColor: productBackdrop }]}>
              {productImage ? (
                <Image source={productImage} style={styles.productImage} resizeMode="cover" />
              ) : (
                <Ionicons name="leaf-outline" size={26} color={colors.forest} />
              )}
            </View>
            <View style={styles.productCopy}>
              <Text style={styles.productName} numberOfLines={2}>
                {productName}
              </Text>
              <View style={styles.quantityRow}>
                <Ionicons name="basket-outline" size={15} color={colors.success} />
                <Text style={styles.quantityText}>{itemLabel}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.actions, stackActions && styles.actionsStacked]}>
            <Button
              label="Continue shopping"
              variant="secondary"
              onPress={onContinueShopping}
              style={actionButtonStyle}
              testID="added-to-basket-continue-shopping"
            />
            <Button
              label="Go to basket"
              arrow
              onPress={onGoToBasket}
              style={actionButtonStyle}
              testID="added-to-basket-go-to-basket"
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
  successBanner: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: '#EEF4E4',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: 60,
  },
  successIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  successCopy: { flex: 1 },
  eyebrow: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  heading: {
    color: colors.forest,
    fontFamily: fonts.serifBold,
    fontSize: 23,
    lineHeight: 28,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
  },
  imageFrame: {
    width: 70,
    height: 70,
    overflow: 'hidden',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: { width: '100%', height: '100%' },
  productCopy: { flex: 1, minWidth: 0 },
  productName: {
    color: colors.ink,
    fontFamily: fonts.serifBold,
    fontSize: 18,
    lineHeight: 23,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.xs,
  },
  quantityText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
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
