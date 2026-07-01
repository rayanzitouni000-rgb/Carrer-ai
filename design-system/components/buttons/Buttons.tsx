import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { opacity as opacityToken } from '../../tokens';
import { useTheme } from '../../theme';
import { PressableScale } from '../primitives/PressableScale';
import { Text } from '../primitives/Text';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
}

function getSizeStyles(theme: ReturnType<typeof useTheme>, size: ButtonSize) {
  const map = {
    sm: { py: theme.spacing['2'], px: theme.spacing['4'], minH: 36 },
    md: { py: theme.spacing['3'], px: theme.spacing['5'], minH: 44 },
    lg: { py: theme.spacing['4'], px: theme.spacing['6'], minH: 52 },
  };
  return map[size];
}

function ButtonContent({
  label,
  loading,
  leftIcon,
  rightIcon,
  textColor,
}: {
  label: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  textColor: string;
}) {
  const theme = useTheme();

  if (loading) {
    return <ActivityIndicator color={textColor} size="small" />;
  }

  return (
    <View style={styles.content}>
      {leftIcon}
      <Text variant="button" color={textColor}>
        {label}
      </Text>
      {rightIcon}
    </View>
  );
}

export function PrimaryButton({
  label,
  size = 'md',
  loading,
  fullWidth,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: BaseButtonProps) {
  const theme = useTheme();
  const sizes = getSizeStyles(theme, size);
  const isDisabled = disabled || loading;

  return (
    <PressableScale disabled={isDisabled} style={[fullWidth && styles.fullWidth, style]} {...props}>
      <LinearGradient
        colors={[...theme.colors.brand.gradient]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.base,
          theme.shadows.glow,
          {
            paddingVertical: sizes.py,
            paddingHorizontal: sizes.px,
            minHeight: sizes.minH,
            borderRadius: theme.radius.md,
            opacity: isDisabled ? opacityToken.disabled : 1,
          },
        ]}
      >
        <ButtonContent
          label={label}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          textColor={theme.colors.text.primary}
        />
      </LinearGradient>
    </PressableScale>
  );
}

export function SecondaryButton({
  label,
  size = 'md',
  loading,
  fullWidth,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: BaseButtonProps) {
  const theme = useTheme();
  const sizes = getSizeStyles(theme, size);
  const isDisabled = disabled || loading;

  return (
    <PressableScale disabled={isDisabled} style={[fullWidth && styles.fullWidth, style]} {...props}>
      <View
        style={[
          styles.base,
          {
            backgroundColor: theme.colors.card.elevated,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            paddingVertical: sizes.py,
            paddingHorizontal: sizes.px,
            minHeight: sizes.minH,
            borderRadius: theme.radius.md,
            opacity: isDisabled ? opacityToken.disabled : 1,
          },
        ]}
      >
        <ButtonContent
          label={label}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          textColor={theme.colors.text.primary}
        />
      </View>
    </PressableScale>
  );
}

export function OutlineButton({
  label,
  size = 'md',
  loading,
  fullWidth,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: BaseButtonProps) {
  const theme = useTheme();
  const sizes = getSizeStyles(theme, size);
  const isDisabled = disabled || loading;

  return (
    <PressableScale disabled={isDisabled} style={[fullWidth && styles.fullWidth, style]} {...props}>
      <View
        style={[
          styles.base,
          {
            backgroundColor: theme.colors.transparent,
            borderWidth: 1.5,
            borderColor: theme.colors.brand.primary,
            paddingVertical: sizes.py,
            paddingHorizontal: sizes.px,
            minHeight: sizes.minH,
            borderRadius: theme.radius.md,
            opacity: isDisabled ? opacityToken.disabled : 1,
          },
        ]}
      >
        <ButtonContent
          label={label}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          textColor={theme.colors.brand.primaryLight}
        />
      </View>
    </PressableScale>
  );
}

export function GlassButton({
  label,
  size = 'md',
  loading,
  fullWidth,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: BaseButtonProps) {
  const theme = useTheme();
  const sizes = getSizeStyles(theme, size);
  const isDisabled = disabled || loading;

  return (
    <Pressable disabled={isDisabled} style={[fullWidth && styles.fullWidth, style]} {...props}>
      <BlurView
        intensity={40}
        tint={theme.isDark ? 'dark' : 'light'}
        style={[
          styles.base,
          {
            borderWidth: 1,
            borderColor: theme.colors.border.subtle,
            paddingVertical: sizes.py,
            paddingHorizontal: sizes.px,
            minHeight: sizes.minH,
            borderRadius: theme.radius.md,
            overflow: 'hidden',
            opacity: isDisabled ? opacityToken.disabled : 1,
          },
        ]}
      >
        <ButtonContent
          label={label}
          loading={loading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          textColor={theme.colors.text.primary}
        />
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
});
