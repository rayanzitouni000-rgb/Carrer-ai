import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AISuggestionCard, SkillBadge, Text, useTheme } from '@/design-system';

import { CV_ANALYSIS } from '../constants/mockData';

export function MissingKeywordsCard() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(360).duration(500).springify()}>
      <View style={styles.section}>
        <Text variant="title" color={theme.colors.text.primary}>
          Missing Keywords
        </Text>
        <View style={styles.chips}>
          {CV_ANALYSIS.missingKeywords.map((keyword, index) => (
            <Animated.View key={keyword} entering={FadeIn.delay(400 + index * 50).duration(300)}>
              <SkillBadge label={keyword} variant="primary" />
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export function AiRecommendationsCard() {
  return (
    <Animated.View entering={FadeInDown.delay(420).duration(500).springify()}>
      <AISuggestionCard
        title="AI Recommendation"
        suggestion={CV_ANALYSIS.aiRecommendation}
        actionLabel="Apply suggestion"
        onAction={() => {}}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
