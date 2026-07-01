import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import { Text, useFadeIn, useTheme } from '@/design-system';

interface WelcomeStepProps {
  title: string;
  subtitle: string;
}

export function WelcomeStep({ title, subtitle }: WelcomeStepProps) {
  const theme = useTheme();
  const { animatedStyle, start } = useFadeIn(0, 500);

  useEffect(() => {
    start();
  }, [start]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(59,130,246,0.25)', 'transparent']}
        style={[styles.glow, { borderRadius: theme.radius['2xl'] }]}
      />
      <Animated.View style={[styles.content, animatedStyle]}>
        <LinearGradient
          colors={[...theme.colors.gradients.brandSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.badge, { borderRadius: theme.radius.full }]}
        >
          <Text variant="caption" color={theme.colors.brand.primary}>
            AI Career Profile
          </Text>
        </LinearGradient>
        <Text variant="h1" color={theme.colors.text.primary} style={styles.title}>
          {title}
        </Text>
        <Text variant="body" color={theme.colors.text.secondary} style={styles.subtitle}>
          {subtitle}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: 40,
    right: -20,
    width: 200,
    height: 200,
    opacity: 0.6,
  },
  content: {
    gap: 20,
    paddingVertical: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  title: {
    lineHeight: 40,
  },
  subtitle: {
    lineHeight: 26,
    maxWidth: 340,
  },
});
