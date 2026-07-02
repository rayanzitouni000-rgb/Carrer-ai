import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@/design-system';
import type { InterviewAnswer, InterviewQuestion } from '@/types/interviewSimulator';

interface FeedbackQuestionAccordionProps {
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
}

export function FeedbackQuestionAccordion({ questions, answers }: FeedbackQuestionAccordionProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="h3" color={theme.colors.text.primary}>
        Détail des réponses
      </Text>
      {questions.map((question) => {
        const answer = answers.find((item) => item.questionId === question.id);
        return (
          <View
            key={question.id}
            style={[
              styles.item,
              {
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <Text variant="title" color={theme.colors.text.primary}>
              {question.text}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {answer?.text?.trim() || 'Pas de réponse enregistrée'}
            </Text>
            {question.tip && (
              <Text variant="caption" color={theme.colors.text.muted}>
                Conseil : {question.tip}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  item: {
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
});
