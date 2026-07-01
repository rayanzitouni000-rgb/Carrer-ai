import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { AISuggestionCard, Card, Icon, Text, useTheme } from '@/design-system';

import { AI_FEEDBACK, IMPROVEMENT_AREAS } from '../constants/mockData';

export function AiFeedbackCard() {
  return (
    <Animated.View entering={FadeInDown.delay(360).duration(500).springify()}>
      <AISuggestionCard
        title="AI Feedback"
        suggestion={AI_FEEDBACK}
        actionLabel="View detailed report"
        onAction={() => {}}
      />
    </Animated.View>
  );
}

export function ImprovementAreasCard() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
      <View style={styles.section}>
        <Text variant="title" color={theme.colors.text.primary}>
          Improvement Areas
        </Text>
        <View style={styles.grid}>
          {IMPROVEMENT_AREAS.map((area, index) => (
            <Animated.View key={area} entering={FadeInRight.delay(420 + index * 50).duration(350)}>
              <Card padding="4" style={styles.item}>
                <Icon name="arrow-up-circle-outline" size="sm" color={theme.colors.status.warning} />
                <Text variant="caption" color={theme.colors.text.secondary} style={styles.label}>
                  {area}
                </Text>
              </Card>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: '47%',
    flex: 1,
  },
  label: { flex: 1, fontWeight: '600', lineHeight: 16 },
});
