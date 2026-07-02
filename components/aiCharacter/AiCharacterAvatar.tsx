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

const SIZE_MAP: Record<AiCharacterSize, { width: number; height: number; clip: number }> = {
  small: { width: 48, height: 48, clip: 48 },
  medium: { width: 120, height: 160, clip: 112 },
  large: { width: 250, height: 350, clip: 220 },
};

export function AiCharacterAvatar({
  size = 'medium',
  style,
}: AiCharacterAvatarProps) {
  const dimensions = SIZE_MAP[size];
  const clipSize = dimensions.clip;
  const clipRadius = clipSize / 2;
  const floatY = useSharedValue(0);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.6);

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
      <Animated.View
        style={[
          styles.inner,
          containerStyle,
          { width: clipSize, height: clipSize, borderRadius: clipRadius },
        ]}
      >
        <Animated.View
          style={[
            styles.halo,
            haloStyle,
            {
              width: clipSize,
              height: clipSize,
              borderRadius: clipRadius,
            },
          ]}
        />

        <View
          style={[
            styles.imageFrame,
            {
              width: clipSize,
              height: clipSize,
              borderRadius: clipRadius,
            },
          ]}
        >
          <Image
            source={AI_CHARACTER_IMAGE}
            style={styles.image}
            contentFit="cover"
            contentPosition="top center"
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
    overflow: 'hidden',
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
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 0.94 }],
  },
});
