import { StyleSheet, View } from 'react-native';
import { useRef } from 'react';
import { useRouter } from 'expo-router';

import {
  Icon,
  LoadingSpinner,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  useTheme,
} from '@/design-system';

import { CareerGoalStep } from './components/CareerGoalStep';
import { CurrentProfileStep } from './components/CurrentProfileStep';
import { EducationDetailsStep } from './components/EducationDetailsStep';
import { ExperienceStep } from './components/ExperienceStep';
import {
  OnboardingProgressBar,
  StepTransition,
} from './components/OnboardingProgressBar';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { SkillsStep } from './components/SkillsStep';
import { SummaryStep } from './components/SummaryStep';
import { TargetRoleStep } from './components/TargetRoleStep';
import { WelcomeStep } from './components/WelcomeStep';
import { FORM_STEPS } from './constants';
import { useCareerOnboarding } from './hooks/useCareerOnboarding';
import { useResetCareerProfile } from './hooks/useResetCareerProfile';
import type { CareerOnboardingStep } from './types';

const STEP_LABELS: Record<(typeof FORM_STEPS)[number], string> = {
  personal: 'Informations personnelles',
  currentProfile: 'Profil actuel',
  educationDetails: "Domaine d'études",
  experience: 'Expérience professionnelle',
  goal: 'Objectif principal',
  targetRole: 'Poste(s) visé(s)',
  skills: 'Compétences',
};

function renderStep(
  step: CareerOnboardingStep,
  profile: ReturnType<typeof useCareerOnboarding>['profile'],
  updateProfile: ReturnType<typeof useCareerOnboarding>['updateProfile'],
  onRegisterSkillsScrollDismiss?: (handler: (() => void) | null) => void
) {
  switch (step) {
    case 'welcome':
      return (
        <WelcomeStep
          title="Personnalisons ton expérience CareerPilot"
          subtitle="Quelques infos sur toi pour que ton coach IA carrière t'accompagne au mieux."
        />
      );
    case 'personal':
      return <PersonalInfoStep profile={profile} onChange={updateProfile} />;
    case 'currentProfile':
      return <CurrentProfileStep profile={profile} onChange={updateProfile} />;
    case 'educationDetails':
      return <EducationDetailsStep profile={profile} onChange={updateProfile} />;
    case 'experience':
      return <ExperienceStep profile={profile} onChange={updateProfile} />;
    case 'goal':
      return <CareerGoalStep profile={profile} onChange={updateProfile} />;
    case 'targetRole':
      return <TargetRoleStep profile={profile} onChange={updateProfile} />;
    case 'skills':
      return (
        <SkillsStep
          profile={profile}
          onChange={updateProfile}
          onRegisterScrollDismiss={onRegisterSkillsScrollDismiss}
        />
      );
    case 'summary':
      return <SummaryStep profile={profile} />;
    default:
      return null;
  }
}

function getContinueLabel(step: CareerOnboardingStep): string {
  if (step === 'welcome') return 'Commencer';
  if (step === 'summary') return "Continuer vers l'inscription";
  return 'Continuer';
}

export function CareerOnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    step,
    formProgress,
    profile,
    updateProfile,
    canContinue,
    goNext,
    goBack,
    completeOnboarding,
    isFirstStep,
    isSummary,
    showProgress,
    isReady,
    resetOnboarding,
  } = useCareerOnboarding();
  const skillsScrollDismissRef = useRef<(() => void) | null>(null);

  const { confirmReset } = useResetCareerProfile({
    redirectTo: '/career-onboarding',
    onReset: () => {
      void resetOnboarding();
    },
  });

  const hasProfileData =
    profile.firstName.trim().length > 0 ||
    profile.skills.length > 0 ||
    profile.completedAt !== null;

  const showResetMenu =
    hasProfileData && step !== 'welcome' && !isSummary;

  const handleSkillsScrollDismiss = (handler: (() => void) | null) => {
    skillsScrollDismissRef.current = handler;
  };

  const handleScrollBeginDrag = () => {
    if (step === 'skills') {
      skillsScrollDismissRef.current?.();
    }
  };

  const formStepIndex = FORM_STEPS.indexOf(step as (typeof FORM_STEPS)[number]);
  const stepLabel =
    formStepIndex >= 0
      ? `Étape ${formStepIndex + 1} sur ${FORM_STEPS.length} · ${STEP_LABELS[step as (typeof FORM_STEPS)[number]]}`
      : '';

  const handleContinue = () => {
    if (isSummary) {
      completeOnboarding();
      router.replace('/signup');
      return;
    }
    goNext();
  };

  if (!isReady) {
    return (
      <ScreenContainer scrollable={false} safeAreaBottom>
        <LoadingSpinner message="Chargement de ton profil..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scrollable
      safeAreaBottom
      contentStyle={styles.content}
      onScrollBeginDrag={handleScrollBeginDrag}
      headerRight={
        showResetMenu ? (
          <PressableScale onPress={confirmReset} scale={0.92}>
            <View
              style={[
                styles.menuBtn,
                {
                  backgroundColor: theme.colors.card.default,
                  borderRadius: theme.radius.full,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Réinitialiser l'onboarding"
            >
              <Icon name="ellipsis-horizontal" size="md" color={theme.colors.text.muted} />
            </View>
          </PressableScale>
        ) : undefined
      }
    >
      {showProgress && (
        <OnboardingProgressBar progress={formProgress} stepLabel={stepLabel} />
      )}

      <StepTransition stepKey={step}>
        {renderStep(step, profile, updateProfile, handleSkillsScrollDismiss)}
      </StepTransition>

      <View style={[styles.footer, { paddingTop: theme.spacing['6'] }]}>
        <PrimaryButton
          label={getContinueLabel(step)}
          onPress={handleContinue}
          disabled={!canContinue}
          fullWidth
          size="lg"
        />
        {!isFirstStep && !isSummary && (
          <OutlineButton label="Retour" onPress={goBack} fullWidth />
        )}
        {step === 'welcome' && (
          <SecondaryButton
            label="Passer pour l'instant"
            onPress={() => router.replace('/(tabs)')}
            fullWidth
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  footer: {
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 8,
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
