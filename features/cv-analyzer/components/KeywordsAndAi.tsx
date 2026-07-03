import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AISuggestionCard, Text, useTheme } from '@/design-system';

import type { CvAnalysisResult } from '../types/cvAnalysisResult';

interface AiRecommendationsCardProps {
  analysis: CvAnalysisResult;
}

export function AiRecommendationsCard({ analysis }: AiRecommendationsCardProps) {
  const suggestion =
    analysis.improvements[0] ??
    analysis.weaknesses[0] ??
    'Continue à personnaliser ton CV pour chaque candidature.';

  return (
    <Animated.View entering={FadeInDown.delay(420).duration(500).springify()}>
      <AISuggestionCard
        title="Recommandation IA"
        suggestion={suggestion}
        actionLabel="Voir le CV Manager"
        onAction={() => {}}
      />
    </Animated.View>
  );
}

export function MissingKeywordsCard() {
  return null;
}

const styles = StyleSheet.create({
  section: { gap: 12 },
});
