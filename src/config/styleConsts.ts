import { fonts } from '@src/config/fonts';

export const spacing = {
  xxxxs: 2,
  xxxs: 4,
  xxx: 6,
  xxs: 8,
  xx: 10,
  xs: 12,
  ss: 14,
  s: 16,
  m: 20,
  l: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 44,
  '6xl': 48,
  '7xl': 52,
  '8xl': 56,
  '9xl': 60,
  '10xl': 64
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700'
} as const;

export const radius = {
  none: 0,
  xxs: 4,
  xs: 6,
  m: 8,
  l: 12,
  xl: 16,
  '2xl': 20
} as const;

export const borderWidth = {
  none: 0,
  xs: 0.4,
  ss: 0.5,
  s: 0.8,
  m: 1,
  l: 1.5,
  xl: 2
} as const;

export const fontSize = {
  xxxxs: 8,
  xxxs: 10,
  xxs: 12,
  xs: 14,
  s: 16,
  m: 18,
  l: 20,
  xl: 22,
  '2xl': 24,
  '3xl': 26,
  '4xl': 28,
  '5xl': 30,
  '6xl': 32,
  '7xl': 34,
  '8xl': 36,
  '9xl': 38,
  '10xl': 40,
  '11xl': 42,
  '12xl': 64,
  '13xl': 88,
  '14xl': 110,
  '15xl': 144
} as const;

export const lineHeight = {
  xxxs: 10,
  xxs: 12,
  xs: 14,
  s: 16,
  m: 18,
  l: 20,
  xl: 22,
  '2xl': 24,
  '3xl': 26,
  '4xl': 28,
  '5xl': 30,
  '6xl': 32,
  '7xl': 34,
  '8xl': 36,
  '9xl': 38,
  '10xl': 40,
  '11xl': 42,
  '12xl': 56,
  '13xl': 80,
  '14xl': 84,
  '15xl': 96,
  '16xl': 100,
  '17xl': 128,
  '18xl': 132,
  '19xl': 140
} as const;

export const letterSpacing = {
  xxxs: -0.25,
  xxs: -0.2,
  none: 0,
  xs: 0.2,
  s: 0,
  sm: 0.4,
  m: 0.6,
  l: 0.01,
  lg: 0.064,
  xl: 0.072
};

export const opacity = {
  none: 0,
  xxxs: 10,
  xxs: 20,
  xs: 30,
  s: 40,
  m: 50,
  l: 60,
  xl: 70,
  '2xl': 80,
  '3xl': 90,
  '4xl': 100
} as const;

export const htmlHeading = {
  fontFamily: `${fonts.franklinGothicURW}-Dem`,
  fontSize: fontSize.xl,
  lineHeight: lineHeight['2xl'],
  marginTop: spacing.s
};
