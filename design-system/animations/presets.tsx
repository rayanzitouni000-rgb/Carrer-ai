import { ReactNode, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../theme';
import { useFadeIn, useFloatingAnimation } from './hooks';

interface FloatingCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  float?: boolean;
}

export function FloatingCard({ children, style, delay = 0, float = true }: FloatingCardProps) {
  const { animatedStyle: fadeStyle, start } = useFadeIn(delay);
  const floatStyle = useFloatingAnimation(float ? 4 : 0);

  useEffect(() => {
    const timer = setTimeout(start, delay);
    return () => clearTimeout(timer);
  }, [start, delay]);

  return (
    <Animated.View style={[float ? floatStyle : undefined, fadeStyle, style]}>
      {children}
    </Animated.View>
  );
}

interface AnimatedGradientProps {
  gradientKey?: keyof ReturnType<typeof useTheme>['colors']['gradients'];
  colors?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function AnimatedGradientBackground({
  gradientKey = 'brandSoft',
  colors: customColors,
  style,
  children,
}: AnimatedGradientProps) {
  const theme = useTheme();
  const gradientColors = customColors ?? theme.colors.gradients[gradientKey];

  return (
    <LinearGradient colors={[...gradientColors]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={style}>
      {children}
    </LinearGradient>
  );
}
