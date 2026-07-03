import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, useTheme } from '@/design-system';

import { CHAT_USER, WELCOME_TOPICS } from '../constants/mockData';

export function WelcomeCard() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
      <LinearGradient
        colors={['#111827', '#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderRadius: theme.radius.xl,
            borderColor: 'rgba(43, 108, 255, 0.2)',
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(59,130,246,0.12)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.xl }]}
        />

        <Text variant="title" color={theme.colors.text.primary}>
          👋 Welcome back, {CHAT_USER.name}.
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.subtitle}>
          Ask me anything about:
        </Text>

        <View style={styles.topics}>
          {WELCOME_TOPICS.map((topic) => (
            <View key={topic} style={styles.topicRow}>
              <Text variant="caption" color={theme.colors.brand.primaryLight}>
                •
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                {topic}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 10,
    overflow: 'hidden',
  },
  subtitle: { marginTop: 2 },
  topics: { gap: 6, marginTop: 4 },
  topicRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
});
