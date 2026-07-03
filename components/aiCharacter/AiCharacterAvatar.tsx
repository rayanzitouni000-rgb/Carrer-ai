import { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AI_COACH_AVATAR } from '@/assets/aiCharacter';

export type AiCharacterState = 'idle' | 'speaking';
export type AiCharacterSize = 'small' | 'fab' | 'medium' | 'large';

interface AiCharacterAvatarProps {
  state: AiCharacterState;
  size?: AiCharacterSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AiCharacterSize, number> = {
  small: 48,
  fab: 56,
  medium: 112,
  large: 180,
};

export function AiCharacterAvatar({
  state = 'idle',
  size = 'medium',
  style,
}: AiCharacterAvatarProps) {
  const dimension = SIZE_MAP[size];
  const isSpeaking = state === 'speaking';
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(isSpeaking ? -3 : -5, {
        duration: isSpeaking ? 900 : 1500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(isSpeaking ? 1.04 : 1, {
        duration: isSpeaking ? 700 : 1500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [floatY, isSpeaking, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.wrapper, { width: dimension, height: dimension }, style, animatedStyle]}
      accessibilityRole="image"
      accessibilityLabel="Coach carrière IA"
    >
      <Image
        source={AI_COACH_AVATAR}
        style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        contentFit="cover"
        transition={0}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
