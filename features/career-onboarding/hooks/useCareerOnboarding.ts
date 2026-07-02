import { useCallback, useEffect, useMemo, useState } from 'react';

import { careerProfileStore } from '@/services/careerProfileStore';
import { persistenceService } from '@/services/persistence';

import { FORM_STEPS } from '../constants';
import { isSituationDetailsComplete } from '../utils/situationDetailsValidation';
import {
  CareerOnboardingStep,
  CareerProfile,
  EMPTY_CAREER_PROFILE,
  MIN_USER_SKILLS,
} from '../types';

const STEP_ORDER: CareerOnboardingStep[] = [
  'welcome',
  ...FORM_STEPS,
  'summary',
];

const LEGACY_STEP_MAP: Record<string, CareerOnboardingStep> = {
  target: 'targetRole',
  education: 'educationDetails',
  educationLevel: 'educationDetails',
  situation: 'educationDetails',
  currentProfile: 'educationDetails',
};

function normalizeOnboardingStep(stored: string | null): CareerOnboardingStep | null {
  if (!stored) return null;
  if (stored in LEGACY_STEP_MAP) return LEGACY_STEP_MAP[stored];
  if (STEP_ORDER.includes(stored as CareerOnboardingStep)) {
    return stored as CareerOnboardingStep;
  }
  return null;
}

export function useCareerOnboarding() {
  const [step, setStep] = useState<CareerOnboardingStep>('welcome');
  const [profile, setProfile] = useState<CareerProfile>({ ...EMPTY_CAREER_PROFILE });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const [storedProfile, storedStepRaw] = await Promise.all([
        careerProfileStore.hydrate(),
        persistenceService.getOnboardingStep(),
      ]);

      if (!mounted) return;

      const storedStep = normalizeOnboardingStep(storedStepRaw);

      setProfile(storedProfile);
      if (storedStep) {
        setStep(storedStep);
        if (storedStepRaw && storedStepRaw in LEGACY_STEP_MAP) {
          void persistenceService.saveOnboardingStep(storedStep);
        }
      }
      setIsReady(true);
    }

    void hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const persistStep = useCallback((nextStep: CareerOnboardingStep) => {
    void persistenceService.saveOnboardingStep(nextStep);
  }, []);

  const stepIndex = STEP_ORDER.indexOf(step);
  const formStepIndex = FORM_STEPS.indexOf(step as (typeof FORM_STEPS)[number]);
  const formProgress =
    formStepIndex >= 0 ? (formStepIndex + 1) / FORM_STEPS.length : 0;

  const updateProfile = useCallback((partial: Partial<CareerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      careerProfileStore.set(next);
      return next;
    });
  }, []);

  const canContinue = useMemo(() => {
    switch (step) {
      case 'welcome':
        return true;
      case 'personal':
        return profile.firstName.trim().length > 0 && profile.ageRange !== null;
      case 'educationDetails':
        return (
          profile.currentSituation !== null &&
          isSituationDetailsComplete(profile.currentSituation, profile.situationDetails) &&
          profile.fieldOfStudy !== null &&
          profile.educationLevel !== null
        );
      case 'experience':
        return (
          profile.hasNoExperience ||
          (profile.experiences ?? []).some((exp) => exp.jobTitle.trim().length > 0)
        );
      case 'goal':
        return profile.careerGoal !== null;
      case 'targetRole':
        return (profile.targetRoles ?? []).length >= 1;
      case 'skills':
        return profile.skills.length >= MIN_USER_SKILLS;
      case 'summary':
        return true;
      default:
        return false;
    }
  }, [step, profile]);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[idx + 1];
      setStep(nextStep);
      persistStep(nextStep);
    }
  }, [step, persistStep]);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) {
      const nextStep = STEP_ORDER[idx - 1];
      setStep(nextStep);
      persistStep(nextStep);
    }
  }, [step, persistStep]);

  const completeOnboarding = useCallback(() => {
    const completed = {
      ...profile,
      completedAt: new Date().toISOString(),
    };
    careerProfileStore.set(completed);
    setProfile(completed);
    persistStep('summary');
  }, [profile, persistStep]);

  const resetOnboarding = useCallback(async () => {
    await persistenceService.clearCareerOnboarding();
    careerProfileStore.resetInMemory();
    setProfile({ ...EMPTY_CAREER_PROFILE });
    setStep('welcome');
    persistStep('welcome');
  }, [persistStep]);

  return {
    step,
    stepIndex,
    formProgress,
    profile,
    updateProfile,
    canContinue,
    goNext,
    goBack,
    completeOnboarding,
    resetOnboarding,
    isReady,
    isFirstStep: stepIndex === 0,
    isSummary: step === 'summary',
    showProgress: FORM_STEPS.includes(step as (typeof FORM_STEPS)[number]),
  };
}
