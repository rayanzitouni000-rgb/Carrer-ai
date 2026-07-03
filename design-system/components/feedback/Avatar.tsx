import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { USER_AVATAR_DEFAULT } from '@/assets/userAvatar';

import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  /** `profile` = image par défaut costume ; `person` = initiales si pas de photo */
  variant?: 'profile' | 'person';
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

export function Avatar({
  name,
  imageUrl,
  variant = 'profile',
  size = 'md',
  style,
  showOnline,
}: AvatarProps) {
  const theme = useTheme();
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const content =
    imageUrl || variant === 'profile' ? (
      <Image
        source={imageUrl ? { uri: imageUrl } : USER_AVATAR_DEFAULT}
        style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        contentFit="cover"
        accessibilityLabel="Photo de profil"
      />
    ) : (
      <View
        style={{
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.brand.primaryDark,
        }}
      >
        <Text variant={size === 'xl' ? 'title' : 'caption'} color={theme.colors.text.primary}>
          {initials}
        </Text>
      </View>
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
