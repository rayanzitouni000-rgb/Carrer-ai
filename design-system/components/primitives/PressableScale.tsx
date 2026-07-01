import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useScalePress } from '../../animations';

interface PressableScaleProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scale?: number;
}

export function PressableScale({ children, style, scale, onPressIn, onPressOut, ...props }: PressableScaleProps) {
  const { animatedStyle, onPressIn: scaleIn, onPressOut: scaleOut } = useScalePress(scale);

  return (
    <Pressable
      onPressIn={(e) => {
        scaleIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scaleOut();
        onPressOut?.(e);
      }}
      {...props}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}
