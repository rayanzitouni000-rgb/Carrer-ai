import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing } from '../../tokens';
import { useTheme } from '../../theme';
import { Text } from '../primitives/Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressBaseProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color,
  trackColor,
  showLabel = true,
  label,
}: ProgressBaseProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(100, Math.max(0, progress)), {
      duration: duration.slow,
      easing: easing.decelerate,
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedProgress.value / 100) * circumference,
  }));

  const stroke = color ?? theme.colors.brand.primary;
  const track = trackColor ?? theme.colors.card.elevated;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelWrap}>
          <Text variant="label" color={theme.colors.text.primary}>
            {Math.round(progress)}%
          </Text>
          {label && (
            <Text variant="caption" color={theme.colors.text.muted}>
              {label}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export function CircularProgress(props: ProgressBaseProps) {
  return <ProgressRing {...props} />;
}

interface LinearProgressProps {
  progress: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export function LinearProgress({
  progress,
  height = 6,
  color,
  showLabel = false,
  label,
}: LinearProgressProps) {
  const theme = useTheme();
  const clamped = Math.min(100, Math.max(0, progress));
  const fillColor = color ?? theme.colors.brand.primary;

  return (
    <View style={styles.linearWrap}>
      {(showLabel || label) && (
        <View style={styles.linearHeader}>
          {label && (
            <Text variant="caption" color={theme.colors.text.secondary}>
              {label}
            </Text>
          )}
          {showLabel && (
            <Text variant="caption" color={theme.colors.text.muted}>
              {Math.round(clamped)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.linearTrack,
          {
            height,
            backgroundColor: theme.colors.card.elevated,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        <View
          style={[
            styles.linearFill,
            {
              width: `${clamped}%`,
              backgroundColor: fillColor,
              borderRadius: theme.radius.full,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  labelWrap: { position: 'absolute', alignItems: 'center' },
  linearWrap: { gap: 6, width: '100%' },
  linearHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  linearTrack: { width: '100%', overflow: 'hidden' },
  linearFill: {},
});
