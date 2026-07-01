import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 450,
  slower: 600,
  loading: 1200,
} as const;

export const spring = {
  gentle: { damping: 20, stiffness: 180, mass: 0.8 },
  snappy: { damping: 18, stiffness: 280, mass: 0.6 },
  bouncy: { damping: 12, stiffness: 200, mass: 0.7 },
  stiff: { damping: 24, stiffness: 320, mass: 0.5 },
} as const;

export const easing = {
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
} as const;

export const scale = {
  press: 0.97,
  pressSubtle: 0.985,
  hover: 1.02,
} as const;

export const opacity = {
  disabled: 0.45,
  muted: 0.65,
  overlay: 0.72,
} as const;
