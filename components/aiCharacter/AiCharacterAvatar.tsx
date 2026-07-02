import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AI_CHARACTER_IMAGE } from '@/assets/aiCharacter';

export type AiCharacterState = 'idle' | 'speaking';
export type AiCharacterSize = 'small' | 'medium' | 'large';

interface AiCharacterAvatarProps {
  state: AiCharacterState;
  size?: AiCharacterSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AiCharacterSize, { width: number; height: number }> = {
  small: { width: 48, height: 48 },
  medium: { width: 120, height: 160 },
  large: { width: 250, height: 350 },
};

export function AiCharacterAvatar({
  size = 'medium',
  style,
}: AiCharacterAvatarProps) {
  const dimensions = SIZE_MAP[size];
  const floatY = useSharedValue(0);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.6);
  const useDarkBackdrop = size === 'large';

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-6, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    haloScale.value = withRepeat(
      withTiming(1.08, { duration: 1250, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    haloOpacity.value = withRepeat(
      withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [floatY, haloOpacity, haloScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));

  return (
    <Animated.View
      style={[styles.wrapper, { width: dimensions.width, height: dimensions.height }, style]}
      accessibilityRole="image"
      accessibilityLabel="Assistant IA carrière"
    >
      <Animated.View style={[styles.inner, containerStyle]}>
        <Animated.View
          style={[
            styles.halo,
            haloStyle,
            {
              width: dimensions.width * 0.85,
              height: dimensions.width * 0.85,
              borderRadius: dimensions.width * 0.425,
            },
          ]}
        />

        <View
          style={[
            styles.imageFrame,
            useDarkBackdrop && styles.imageFrameDark,
            { width: dimensions.width, height: dimensions.height },
          ]}
        >
          <Image
            source={AI_CHARACTER_IMAGE}
            style={styles.image}
            contentFit="contain"
            transition={0}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    backgroundColor: 'rgba(99, 102, 241, 0.35)',
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 8,
  },
  imageFrame: {
    position: 'relative',
    overflow: 'visible',
  },
  imageFrameDark: {
    backgroundColor: '#000000',
    borderRadius: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
