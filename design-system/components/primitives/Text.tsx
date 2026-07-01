import { Text as RNText, TextProps, TextStyle, StyleProp } from 'react-native';

import { useTheme } from '../../theme';
import { TypographyVariantKey } from '../../theme/types';

interface TextComponentProps extends TextProps {
  variant?: TypographyVariantKey;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
}

export function Text({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}: TextComponentProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[
        theme.typography[variant],
        { color: color ?? theme.colors.text.primary, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
