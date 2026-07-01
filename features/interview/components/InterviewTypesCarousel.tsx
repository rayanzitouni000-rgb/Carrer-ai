import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';

import { INTERVIEW_TYPES } from '../constants/mockData';

export function InterviewTypesCarousel() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Interview Types
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {INTERVIEW_TYPES.map((type, index) => (
          <Animated.View key={type.id} entering={FadeInRight.delay(index * 60).duration(400).springify()}>
            <PressableScale scale={0.95}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.card.default,
                    borderColor: theme.colors.border.subtle,
                    borderRadius: theme.radius.lg,
                  },
                ]}
              >
                <LinearGradient
                  colors={[...type.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.iconWrap, { borderRadius: theme.radius.md }]}
                >
                  <Icon name={type.icon} size="md" color="#FFFFFF" />
                </LinearGradient>
                <Text variant="caption" color={theme.colors.text.primary} style={styles.label}>
                  {type.label}
                </Text>
              </View>
            </PressableScale>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  scroll: { gap: 12 },
  card: {
    width: 100,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '600', textAlign: 'center' },
});
