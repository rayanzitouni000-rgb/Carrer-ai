import { Ionicons } from '@expo/vector-icons';

import { IconName, iconSize } from '../../tokens';
import { useTheme } from '../../theme';

type IconSizeKey = keyof typeof iconSize;

interface IconProps {
  name: IconName;
  size?: IconSizeKey | number;
  color?: string;
}

export function Icon({ name, size = 'md', color }: IconProps) {
  const theme = useTheme();
  const resolvedSize = typeof size === 'number' ? size : iconSize[size];

  return <Ionicons name={name} size={resolvedSize} color={color ?? theme.colors.text.secondary} />;
}
