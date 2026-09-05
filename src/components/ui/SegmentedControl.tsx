import React, { useEffect, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow } from '@/theme/tokens';

export type SegmentOption<T extends string> = {
  label: string;
  value: T;
  testID?: string;
};

type Props<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: object;
};

// Pill background between two-or-more options that physically slides to the
// selected one — was a plain per-button colour swap (orders.tsx's old
// segment/segmentBtnActive), which just snapped instantly. Reused wherever
// the app needs this kind of toggle (currently orders.tsx's "In progress" /
// "Past orders") rather than each screen reimplementing its own.
export function SegmentedControl<T extends string>({ options, value, onChange, style }: Props<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  // useState (not useRef().current) so this stays outside the
  // react-hooks/refs "no ref reads during render" rule — a state
  // initializer still only constructs the Animated.Value once.
  const [translateX] = useState(() => new Animated.Value(0));
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  // Inset by the track's own padding (4 on each side) so the pill's travel
  // distance matches exactly where each button actually sits.
  const trackPadding = 4;
  const innerWidth = Math.max(0, trackWidth - trackPadding * 2);
  const segmentWidth = options.length > 0 ? innerWidth / options.length : 0;

  useEffect(() => {
    if (!trackWidth) return;
    Animated.timing(translateX, {
      toValue: segmentWidth * selectedIndex,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, segmentWidth, trackWidth, translateX]);

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View style={[styles.track, style]} onLayout={onLayout}>
      {trackWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { width: segmentWidth, transform: [{ translateX }] }]}
        />
      ) : null}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            testID={option.testID}
            style={styles.btn}
            onPress={() => onChange(option.value)}>
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: radii.pill,
    padding: 4,
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    ...shadow.card,
    shadowOpacity: 0.06,
  },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: radii.pill },
  text: { fontSize: 14, fontWeight: '700', color: colors.muted },
  textActive: { color: colors.ink },
});
