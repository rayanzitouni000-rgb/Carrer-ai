import { StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { usePulseAnimation, useFloatingAnimation } from '../../animations';
import { useTheme } from '../../theme';
import { Icon } from '../primitives/Icon';
import { PressableScale } from '../primitives/PressableScale';

interface AnimatedAIOrbProps {
  size?: number;
  style?: ViewStyle;
}

export function AnimatedAIOrb({ size = 64, style }: AnimatedAIOrbProps) {
  const theme = useTheme();
  const pulseStyle = usePulseAnimation(0.94, 1.06);
  const floatStyle = useFloatingAnimation(3);

  return (
    <Animated.View style={[pulseStyle, floatStyle, style]}>
      <LinearGradient
        colors={[...theme.colors.gradients.ai]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.orb,
          theme.shadows.glow,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Icon name="sparkles" size={size * 0.38} color={theme.colors.text.primary} />
      </LinearGradient>
    </Animated.View>
  );
}

interface FloatingAIButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  size?: number;
}

export function FloatingAIButton({ onPress, style, size = 60 }: FloatingAIButtonProps) {
  const theme = useTheme();
  const floatStyle = useFloatingAnimation(5);

  return (
    <Animated.View style={[styles.fabWrap, floatStyle, style]}>
      <PressableScale onPress={onPress} scale={0.94}>
        <LinearGradient
          colors={[...theme.colors.brand.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fab,
            theme.shadows.glow,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Icon name="sparkles-outline" size="md" color={theme.colors.text.primary} />
        </LinearGradient>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrap: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 100,
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
