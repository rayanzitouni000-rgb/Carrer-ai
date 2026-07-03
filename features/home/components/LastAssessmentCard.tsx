import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, OutlineButton, PrimaryButton, Text, useTheme } from '@/design-system';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { careerProfileStore } from '@/services/careerProfileStore';
import { scoreToLevelLabel } from '@/utils/interviewSimulatorUtils';

export function LastAssessmentCard() {
  const theme = useTheme();
  const router = useRouter();
  const { lastAssessmentScore } = useOnboardingAssessment();
  const targetRole = careerProfileStore.get().targetRoles[0] ?? 'Poste visé';

  const handleStartAssessment = () => {
    router.push('/(tabs)/interview-simulator/onboarding-assessment');
  };

  const handleRetest = () => {
    router.push({
      pathname: '/(tabs)/interview-simulator/session',
      params: { isAssessment: 'true', targetRole },
    });
  };

  if (lastAssessmentScore === null) {
    return (
      <View style={styles.section}>
        <Card variant="elevated" padding="4" style={styles.card}>
          <Text variant="title" color={theme.colors.text.primary}>
            🎤 Ton niveau en entretien
          </Text>
          <Text variant="body" color={theme.colors.text.secondary} style={styles.emptyText}>
            Pas encore évalué
          </Text>
          <PrimaryButton label="Faire le test maintenant" fullWidth onPress={handleStartAssessment} />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <Text variant="title" color={theme.colors.text.primary}>
          🎤 Ton niveau en entretien
        </Text>
        <Text variant="hero" color={theme.colors.brand.primaryLight} style={styles.score}>
          {lastAssessmentScore.toFixed(1)} / 10
        </Text>
        <Text variant="label" color={theme.colors.text.secondary}>
          {scoreToLevelLabel(lastAssessmentScore)}
        </Text>
        <OutlineButton label="Refaire un test" fullWidth onPress={handleRetest} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  card: { gap: 12 },
  score: { marginTop: 4 },
  emptyText: { marginVertical: 4 },
});
