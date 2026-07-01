import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

import { useTheme } from '../../theme';
import { SpacingKey } from '../../tokens';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'glass';
  padding?: SpacingKey;
}

export function Card({
  children,
  variant = 'default',
  padding = '4',
  style,
  ...props
}: CardProps) {
  const theme = useTheme();

  if (variant === 'glass') {
    return (
      <BlurView
        intensity={35}
        tint={theme.isDark ? 'dark' : 'light'}
        style={[
          {
            padding: theme.spacing[padding],
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border.subtle,
            overflow: 'hidden',
          },
          style,
        ]}
        {...props}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        {
          padding: theme.spacing[padding],
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
          backgroundColor:
            variant === 'elevated' ? theme.colors.card.elevated : theme.colors.card.default,
        },
        variant === 'elevated' && theme.shadows.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
