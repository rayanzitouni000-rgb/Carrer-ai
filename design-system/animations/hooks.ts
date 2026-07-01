import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { scale as scaleToken, spring, duration, easing } from '../tokens';

export function useScalePress(activeScale = scaleToken.press) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(activeScale, spring.snappy);
  }, [activeScale, scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, spring.snappy);
  }, [scale]);

  return { animatedStyle, onPressIn, onPressOut };
}

export function useFadeIn(delay = 0, durationMs = duration.normal) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  const start = useCallback(() => {
    opacity.value = withTiming(1, { duration: durationMs, easing: easing.decelerate });
    translateY.value = withTiming(0, { duration: durationMs, easing: easing.decelerate });
  }, [opacity, translateY, durationMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, start, delay };
}

export function useSlideIn(fromX = 24, durationMs = duration.normal) {
  const translateX = useSharedValue(fromX);
  const opacity = useSharedValue(0);

  const start = useCallback(() => {
    translateX.value = withTiming(0, { duration: durationMs, easing: easing.decelerate });
    opacity.value = withTiming(1, { duration: durationMs, easing: easing.decelerate });
  }, [translateX, opacity, durationMs, fromX]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return { animatedStyle, start };
}

export function useFloatingAnimation(amplitude = 6) {
  const translateY = useSharedValue(0);

  translateY.value = withRepeat(
    withSequence(
      withTiming(-amplitude, { duration: duration.slower, easing: easing.standard }),
      withTiming(amplitude, { duration: duration.slower, easing: easing.standard })
    ),
    -1,
    true
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

export function usePulseAnimation(min = 0.92, max = 1.08) {
  const pulse = useSharedValue(min);

  pulse.value = withRepeat(
    withSequence(
      withTiming(max, { duration: duration.loading / 2, easing: easing.standard }),
      withTiming(min, { duration: duration.loading / 2, easing: easing.standard })
    ),
    -1,
    true
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return animatedStyle;
}

export function useShimmerAnimation(width: number) {
  const progress = useSharedValue(0);

  progress.value = withRepeat(
    withTiming(1, { duration: duration.loading, easing: easing.standard }),
    -1,
    false
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-width, width], Extrapolation.CLAMP),
      },
    ],
  }));

  return animatedStyle;
}

export function useProgressAnimation(target: number, durationMs = duration.slow) {
  const progress = useSharedValue(0);

  const animateTo = useCallback(
    (value: number) => {
      progress.value = withTiming(Math.min(100, Math.max(0, value)), {
        duration: durationMs,
        easing: easing.decelerate,
      });
    },
    [progress, durationMs]
  );

  return { progress, animateTo };
}
