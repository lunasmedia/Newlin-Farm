export const colors = {
  cream: '#FBF6EA',
  creamCard: '#FFFFFF',
  forest: '#1E4A3B',
  forestDark: '#163829',
  coral: '#DC4A3C',
  gold: '#F0C743',
  harvest: '#E7A63C',
  ink: '#1F2A22',
  body: '#3A362E',
  muted: '#75715F',
  mutedLight: '#A39C89',
  border: '#E7DFCB',
  inputBg: '#F4EFE1',
  white: '#FFFFFF',
  success: '#2E7D5B',
  blush: '#F6DCD4',
  sage: '#DCE7C0',
  sand: '#EDD9B6',
  sky: '#D8E4EC',
  lavender: '#E3DDEE',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#2B2418',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;
