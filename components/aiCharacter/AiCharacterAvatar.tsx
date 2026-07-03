import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AiCoachBustIllustration } from './AiCoachBustIllustration';

export type AiCharacterState = 'idle' | 'speaking';
export type AiCharacterSize = 'small' | 'medium' | 'large';

interface AiCharacterAvatarProps {
  state: AiCharacterState;
  size?: AiCharacterSize;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AiCharacterSize, { width: number; height: number; clip: number }> = {
  small: { width: 48, height: 56, clip: 48 },
  medium: { width: 120, height: 140, clip: 112 },
  large: { width: 200, height: 230, clip: 180 },
};

export function AiCharacterAvatar({
  state = 'idle',
  size = 'medium',
  style,
}: AiCharacterAvatarProps) {
  const dimensions = SIZE_MAP[size];
  const clipSize = dimensions.clip;
  const clipRadius = clipSize / 2;
  const isSpeaking = state === 'speaking';
  const floatY = useSharedValue(0);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.6);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(isSpeaking ? -3 : -5, {
        duration: isSpeaking ? 900 : 1500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    haloScale.value = withRepeat(
      withTiming(isSpeaking ? 1.12 : 1.06, {
        duration: isSpeaking ? 700 : 1250,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    haloOpacity.value = withRepeat(
      withTiming(isSpeaking ? 0.9 : 0.65, {
        duration: isSpeaking ? 700 : 1250,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [floatY, haloOpacity, haloScale, isSpeaking]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));

  const illustrationWidth = clipSize * 0.82;
  const illustrationHeight = illustrationWidth * 1.2;

  return (
    <Animated.View
      style={[styles.wrapper, { width: dimensions.width, height: dimensions.height }, style]}
      accessibilityRole="image"
      accessibilityLabel="Coach carrière IA"
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
              backgroundColor: isSpeaking ? 'rgba(43, 108, 255, 0.28)' : 'rgba(30, 107, 255, 0.2)',
              shadowColor: isSpeaking ? '#60A5FA' : '#2B6CFF',
              shadowRadius: isSpeaking ? 28 : 20,
            },
          ]}
        />

        <View
          style={[
            styles.frame,
            {
              width: clipSize,
              height: clipSize,
              borderRadius: clipRadius,
              borderColor: isSpeaking ? 'rgba(96, 165, 250, 0.5)' : 'rgba(43, 108, 255, 0.35)',
            },
          ]}
        >
          <View style={styles.illustrationWrap}>
            <AiCoachBustIllustration
              state={state}
              width={illustrationWidth}
              height={illustrationHeight}
            />
          </View>
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    elevation: 8,
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: '#0b1220',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
