import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SkillBadge, Text, useTheme } from '@/design-system';
import type { InterviewFeedback } from '@/types/interviewSimulator';
import { formatAssessmentLevel } from '@/utils/interviewSimulatorUtils';

interface FeedbackSummaryCardProps {
  feedback: InterviewFeedback;
  isAssessment?: boolean;
}

export function FeedbackSummaryCard({ feedback, isAssessment }: FeedbackSummaryCardProps) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={['#2B6CFF', '#2B6CFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: theme.radius.lg }]}
    >
      <Text variant="caption" color="rgba(255,255,255,0.85)">
        {isAssessment ? 'Niveau initial' : 'Score global'}
      </Text>
      <Text variant="hero" color="#FFFFFF">
        {isAssessment ? formatAssessmentLevel(feedback.overallScore) : `${feedback.overallScore}/10`}
      </Text>
      <Text variant="bodySmall" color="rgba(255,255,255,0.9)">
        {feedback.summary}
      </Text>
      <View style={styles.tags}>
        {feedback.strengths.slice(0, 2).map((item) => (
          <SkillBadge key={item} label={item} variant="success" />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
