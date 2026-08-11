import { Platform } from 'react-native';

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 64,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = 72;
export const MaxContentWidth = 720;

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    secondaryText: '#687076',
    background: '#FFFFFF',
    backgroundElement: '#F1F3F5',
    backgroundSelected: '#E1E5E8',
    accent: '#0A7EA4',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    secondaryText: '#9BA1A6',
    background: '#151718',
    backgroundElement: '#242729',
    backgroundSelected: '#34383B',
    accent: '#5AC8E8',
  },
} as const;
