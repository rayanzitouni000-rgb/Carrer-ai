import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AnimatedEntranceProps {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedEntrance({ children, delay = 0, style }: AnimatedEntranceProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify().damping(18)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/** Animated greeting text with subtle fade */
export function AnimatedGreeting({ children }: { children: ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      {children}
    </Animated.View>
  );
}
