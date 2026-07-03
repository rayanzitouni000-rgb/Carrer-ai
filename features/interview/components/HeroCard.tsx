import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import {
  GlassButton,
  SkillBadge,
  Text,
  useFloatingAnimation,
  usePulseAnimation,
  useTheme,
} from '@/design-system';

import { NEXT_INTERVIEW } from '../constants/mockData';

interface HeroCardProps {
  onStart: () => void;
}

export function HeroCard({ onStart }: HeroCardProps) {
  const theme = useTheme();
  const floatStyle = useFloatingAnimation(3);
  const glowStyle = usePulseAnimation(0.97, 1.03);

  return (
    <Animated.View style={floatStyle}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.glow, glowStyle, { backgroundColor: 'rgba(43, 108, 255, 0.12)' }]} />
        <LinearGradient
          colors={['#1e3a5f', '#1D4ED8', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: theme.radius.xl }]}
        >
          <Text variant="caption" color="rgba(255,255,255,0.75)" style={styles.eyebrow}>
            NEXT INTERVIEW PRACTICE
          </Text>
          <Text variant="h3" color="#FFFFFF">
            {NEXT_INTERVIEW.role}
          </Text>
          <Text variant="bodySmall" color="rgba(255,255,255,0.85)">
            {NEXT_INTERVIEW.company}
          </Text>

          <View style={styles.meta}>
            <SkillBadge label={NEXT_INTERVIEW.difficulty} variant="primary" />
            <View style={styles.duration}>
              <Text variant="caption" color="rgba(255,255,255,0.7)">
                ⏱ {NEXT_INTERVIEW.duration}
              </Text>
            </View>
          </View>

          <GlassButton
            label="Start Interview"
            onPress={onStart}
            style={styles.button}
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glow: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    bottom: -4,
    borderRadius: 24,
  },
  card: {
    padding: 22,
    gap: 8,
    overflow: 'hidden',
  },
  eyebrow: { letterSpacing: 1, fontWeight: '600' },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  duration: { marginLeft: 4 },
  button: { marginTop: 4 },
});
