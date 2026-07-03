import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  showOnline?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

export function Avatar({ name, imageUrl, size = 'md', style, showOnline }: AvatarProps) {
  const theme = useTheme();
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const content = imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
      contentFit="cover"
      accessibilityLabel="Photo de profil"
    />
  ) : (
    <LinearGradient
      colors={[...theme.colors.brand.gradient]}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text variant={size === 'xl' ? 'title' : 'caption'} color={theme.colors.text.primary}>
        {initials}
      </Text>
    </LinearGradient>
  );

  return (
    <View style={style}>
      {content}
      {showOnline && (
        <View
          style={[
            styles.online,
            {
              backgroundColor: theme.colors.status.success,
              borderColor: theme.colors.background.primary,
              width: dimension * 0.28,
              height: dimension * 0.28,
              borderRadius: dimension,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  online: {
    position: 'absolute',
    borderWidth: 2,
  },
});
