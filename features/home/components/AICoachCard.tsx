import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';

import {
  AnimatedAIOrb,
  OutlineButton,
  Text,
  usePulseAnimation,
  useTheme,
} from '@/design-system';

import { AI_COACH_RECOMMENDATION } from '../constants/mockData';

export function AICoachCard() {
  const theme = useTheme();
  const router = useRouter();
  const borderGlow = usePulseAnimation(0.98, 1.02);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.glowBorder,
          borderGlow,
          { borderRadius: theme.radius.xl, borderColor: 'rgba(139, 92, 246, 0.4)' },
        ]}
      />

      <LinearGradient
        colors={['#1a1033', '#16161D', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderRadius: theme.radius.xl, borderColor: 'rgba(139, 92, 246, 0.2)' }]}
      >
        <LinearGradient
          colors={['rgba(139,92,246,0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.xl }]}
        />

        <View style={styles.top}>
          <AnimatedAIOrb size={52} />
          <View style={styles.titles}>
            <Text variant="title" color={theme.colors.text.primary}>
              {AI_COACH_RECOMMENDATION.title}
            </Text>
            <Text variant="caption" color={theme.colors.brand.accentLight}>
              {AI_COACH_RECOMMENDATION.subtitle}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.message}>
          "{AI_COACH_RECOMMENDATION.message}"
        </Text>

        <OutlineButton
          label="Ask AI"
          size="sm"
          onPress={() => router.push('/ai-chat')}
          style={styles.button}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glowBorder: {
    position: 'absolute',
    top: -1,
    left: 8,
    right: 8,
    bottom: -1,
    borderWidth: 1,
  },
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  titles: { flex: 1, gap: 2 },
  message: { lineHeight: 22, fontStyle: 'italic' },
  button: { alignSelf: 'flex-start' },
});
