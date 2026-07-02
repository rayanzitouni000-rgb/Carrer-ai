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

import { AI_CHARACTER_IMAGES } from '@/assets/aiCharacter';

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

const SPARKLE_LAYOUT = [
  { top: '8%', left: '38%', color: '#C084FC', duration: 1800, delay: 0 },
  { top: '12%', left: '58%', color: '#60A5FA', duration: 2200, delay: 400 },
  { top: '18%', left: '28%', color: '#F472B6', duration: 2000, delay: 800 },
  { top: '6%', left: '48%', color: '#A78BFA', duration: 2500, delay: 1200 },
] as const;

function Sparkle({
  color,
  durationMs,
  delayMs,
  size,
}: {
  color: string;
  durationMs: number;
  delayMs: number;
  size: number;
}) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    }, delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, durationMs, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.sparkle,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

export function AiCharacterAvatar({
  state,
  size = 'medium',
  style,
}: AiCharacterAvatarProps) {
  const dimensions = SIZE_MAP[size];
  const speakingOpacity = useSharedValue(state === 'speaking' ? 1 : 0);
  const floatY = useSharedValue(0);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.6);

  useEffect(() => {
    speakingOpacity.value = withTiming(state === 'speaking' ? 1 : 0, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });
  }, [state, speakingOpacity]);

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

  const idleStyle = useAnimatedStyle(() => ({
    opacity: 1 - speakingOpacity.value,
  }));

  const speakingStyle = useAnimatedStyle(() => ({
    opacity: speakingOpacity.value,
  }));

  const sparkleCount = size === 'small' ? 2 : 4;
  const sparkleSize = size === 'small' ? 3 : size === 'medium' ? 4 : 5;
  const useDarkBackdrop = size === 'large';

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
          <Animated.View style={[styles.imageLayer, idleStyle]}>
            <Image
              source={AI_CHARACTER_IMAGES.idle}
              style={styles.image}
              contentFit="contain"
              transition={0}
            />
          </Animated.View>
          <Animated.View style={[styles.imageLayer, speakingStyle]}>
            <Image
              source={AI_CHARACTER_IMAGES.speaking}
              style={styles.image}
              contentFit="contain"
              transition={0}
            />
          </Animated.View>

          {SPARKLE_LAYOUT.slice(0, sparkleCount).map((sparkle, index) => (
            <View
              key={index}
              style={[
                styles.sparkleAnchor,
                { top: sparkle.top as `${number}%`, left: sparkle.left as `${number}%` },
              ]}
            >
              <Sparkle
                color={sparkle.color}
                durationMs={sparkle.duration}
                delayMs={sparkle.delay}
                size={sparkleSize}
              />
            </View>
          ))}
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
  imageLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sparkleAnchor: {
    position: 'absolute',
  },
  sparkle: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
