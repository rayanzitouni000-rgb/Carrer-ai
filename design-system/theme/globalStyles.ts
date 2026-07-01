import { StyleSheet } from 'react-native';

import { Theme } from './types';

export function createGlobalStyles(theme: Theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    screenSecondary: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border.subtle,
    },
    card: {
      backgroundColor: theme.colors.card.default,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
    },
    cardElevated: {
      backgroundColor: theme.colors.card.elevated,
      borderRadius: theme.radius.lg,
      ...theme.shadows.md,
    },
    glass: {
      backgroundColor: theme.colors.card.glass,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      overflow: 'hidden',
    },
    textPrimary: {
      ...theme.typography.body,
      color: theme.colors.text.primary,
    },
    textSecondary: {
      ...theme.typography.bodySmall,
      color: theme.colors.text.secondary,
    },
    textMuted: {
      ...theme.typography.caption,
      color: theme.colors.text.muted,
    },
  });
}

export type GlobalStyles = ReturnType<typeof createGlobalStyles>;
