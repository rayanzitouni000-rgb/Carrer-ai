import { Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';

import {
  Icon,
  PressableScale,
  Text,
  useFloatingAnimation,
  usePulseAnimation,
  useTheme,
} from '@/design-system';

const FAB_BOTTOM = Platform.OS === 'ios' ? 100 : 82;

export function HomeFloatingAI() {
  const theme = useTheme();
  const router = useRouter();
  const floatStyle = useFloatingAnimation(4);
  const pulseStyle = usePulseAnimation(0.96, 1.04);
  const glowStyle = usePulseAnimation(0.9, 1.1);

  return (
    <Animated.View style={[styles.wrap, floatStyle]}>
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          { backgroundColor: 'rgba(59, 130, 246, 0.25)' },
        ]}
      />
      <PressableScale scale={0.94} onPress={() => router.push('/(tabs)/ai-chat')}>
        <Animated.View style={pulseStyle}>
          <LinearGradient
            colors={[...theme.colors.gradients.ai]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fab, theme.shadows.glow]}
          >
            <Icon name="sparkles" size="md" color="#FFFFFF" />
            <Text variant="caption" color="#FFFFFF" style={styles.label}>
              AI Assistant
            </Text>
          </LinearGradient>
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    right: 16,
    zIndex: 100,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -4,
    left: -4,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
  },
  label: { fontWeight: '700' },
});
