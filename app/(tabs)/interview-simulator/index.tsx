import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
  OutlineButton,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';
import { PaywallScreen } from '@/components/premium';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { formatAssessmentLevel } from '@/utils/interviewSimulatorUtils';

export default function InterviewHubScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasCompletedAssessment, hasSkippedAssessment, lastAssessmentScore } =
    useOnboardingAssessment();
  const { nextInterview } = useRealInterviews();
  const { canStartInterviewSession, interviewSessionsThisMonth } = useUsageLimits();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const handleNewSimulation = () => {
    if (!canStartInterviewSession) {
      setPaywallVisible(true);
      return;
    }
    router.push('/(tabs)/interview-simulator/setup');
  };

  const renderLevelCard = () => {
    if (lastAssessmentScore !== null) {
      return (
        <LinearGradient
          colors={['#2B6CFF', '#2B6CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.levelCard, { borderRadius: theme.radius.lg }]}
        >
          <Text variant="caption" color="rgba(255,255,255,0.85)">
            Mon niveau actuel
          </Text>
          <Text variant="hero" color="#FFFFFF">
            {formatAssessmentLevel(lastAssessmentScore)}
          </Text>
        </LinearGradient>
      );
    }

    if (!hasCompletedAssessment) {
      return (
        <View
          style={[
            styles.levelCard,
            {
              backgroundColor: theme.colors.card.elevated,
              borderColor: theme.colors.border.subtle,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <Text variant="title" color={theme.colors.text.primary}>
            Niveau non évalué
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {hasSkippedAssessment
              ? 'Tu peux évaluer ton niveau à tout moment pour personnaliser tes simulations.'
              : 'Pas encore évalué — fais le test initial pour calibrer ton parcours.'}
          </Text>
          <OutlineButton
            label="Évaluer mon niveau maintenant"
            onPress={() => router.push('/(tabs)/interview-simulator/onboarding-assessment')}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: theme.spacing['4'],
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="h2" color={theme.colors.text.primary}>
            Entretien
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            Simule, prépare et progresse avant tes vrais entretiens.
          </Text>
        </View>

        {renderLevelCard()}

        <PrimaryButton
          label="🎯 Nouvelle simulation"
          fullWidth
          size="lg"
          onPress={handleNewSimulation}
        />

        {!canStartInterviewSession && (
          <Text variant="caption" color={theme.colors.status.warning} align="center">
            Limite atteinte ({interviewSessionsThisMonth}/2 ce mois-ci) — passe à Premium pour continuer.
          </Text>
        )}

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.card.elevated,
              borderColor: theme.colors.border.subtle,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <Text variant="label" color={theme.colors.text.muted}>
            Prochain entretien réel
          </Text>
          {nextInterview ? (
            <>
              <Text variant="title" color={theme.colors.text.primary}>
                {nextInterview.jobTitle}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                {nextInterview.company}
              </Text>
              <PrimaryButton
                label="Se préparer"
                size="sm"
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/interview-simulator/session',
                    params: { interviewId: nextInterview.id },
                  })
                }
              />
            </>
          ) : (
            <PressableScale
              scale={0.98}
              onPress={() => router.push('/(tabs)/interview-simulator/add-interview')}
            >
              <Text variant="label" color={theme.colors.brand.primaryLight}>
                + Ajouter un entretien à venir
              </Text>
            </PressableScale>
          )}
        </View>

        <OutlineButton
          label="📋 Mes entretiens"
          fullWidth
          onPress={() => router.push('/(tabs)/interview-simulator/my-interviews')}
        />
      </ScrollView>

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="interview_limit"
        onClose={() => setPaywallVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { gap: 6 },
  levelCard: {
    padding: 18,
    gap: 8,
    borderWidth: 1,
  },
  sectionCard: {
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
});
