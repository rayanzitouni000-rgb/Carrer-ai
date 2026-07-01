import { ReactNode } from 'react';
import { PressableProps, ViewStyle } from 'react-native';

import {
  GlassButton,
  OutlineButton,
  PrimaryButton,
  SecondaryButton,
} from '@/design-system';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface LegacyButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function LegacyButton({
  title,
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  icon,
  style,
  ...props
}: LegacyButtonProps) {
  const common = { label: title, size, loading, fullWidth, leftIcon: icon, style, ...props };

  switch (variant) {
    case 'secondary':
      return <SecondaryButton {...common} />;
    case 'outline':
    case 'ghost':
      return <OutlineButton {...common} />;
    case 'glass':
      return <GlassButton {...common} />;
    default:
      return <PrimaryButton {...common} />;
  }
}

/** Default export used by existing screens */
export function Button(props: LegacyButtonProps) {
  return <LegacyButton {...props} />;
}
