import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, Text, useTheme } from '@/design-system';
import {
  FeedbackQuestionAccordion,
  FeedbackSummaryCard,
} from '@/features/interview/components';
import { useInterviewHistory } from '@/hooks/useInterviewHistory';

export default function InterviewFeedbackScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { sessions, isReady } = useInterviewHistory();

  const session = useMemo(
    () => (sessionId ? sessions.find((item) => item.id === sessionId) : undefined),
    [sessionId, sessions]
  );
  const isAssessment = session?.sessionSource === 'assessment';

  if (!isReady) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <Text variant="body" color={theme.colors.text.secondary}>
          Chargement du feedback...
        </Text>
      </View>
    );
  }

  if (!session || !session.feedback) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <Text variant="title" color={theme.colors.text.primary}>
          Feedback indisponible
        </Text>
        <PrimaryButton label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: theme.spacing['4'],
          gap: 20,
        }}
      >
        <Text variant="h2" color={theme.colors.text.primary}>
          {isAssessment ? 'Voici ton niveau de départ 🎯' : 'Feedback de session'}
        </Text>

        <FeedbackSummaryCard feedback={session.feedback} isAssessment={isAssessment} />
        <FeedbackQuestionAccordion questions={session.questions} answers={session.answers} />

        {isAssessment ? (
          <PrimaryButton
            label="Voir mon Dashboard"
            fullWidth
            onPress={() => router.replace('/(tabs)' as Href)}
          />
        ) : (
          <PrimaryButton label="Retour au Hub Entretien" fullWidth onPress={() => router.replace('./')} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
});
