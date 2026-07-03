import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistenceService } from '@/services/persistence';
import { careerProfileStore } from '@/services/careerProfileStore';
import { getAuthUserFromSession } from '@/hooks/useAuth';
import { shouldOfferOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import type { CareerOnboardingStep } from '@/features/career-onboarding/types';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export type BootstrapRoute =
  | '/(tabs)'
  | '/career-onboarding'
  | '/signup'
  | '/login'
  | '/onboarding'
  | '/(tabs)/interview-simulator/onboarding-assessment';

async function hasRegisteredAccountFlag(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.hasRegisteredAccount);
  return value === 'true';
}

function normalizeStoredStep(step: string | null): CareerOnboardingStep | null {
  if (!step) return null;
  if (step === 'target') return 'targetRole';
  if (step === 'education' || step === 'educationLevel' || step === 'situation' || step === 'currentProfile') {
    return 'educationDetails';
  }
  return step as CareerOnboardingStep;
}

export async function resolveBootstrapRoute(): Promise<BootstrapRoute> {
  const [authUser, storedProfile, storedStepRaw, offerAssessment, hasRegistered] =
    await Promise.all([
      getAuthUserFromSession(),
      persistenceService.getCareerProfile(),
      persistenceService.getOnboardingStep(),
      shouldOfferOnboardingAssessment(),
      hasRegisteredAccountFlag(),
    ]);

  if (storedProfile) {
    careerProfileStore.markHydrated();
    careerProfileStore.set(storedProfile);
  }

  const storedStep = normalizeStoredStep(storedStepRaw);
  if (storedStepRaw === 'target') {
    void persistenceService.saveOnboardingStep('targetRole');
  }
  if (
    storedStepRaw === 'education' ||
    storedStepRaw === 'educationLevel' ||
    storedStepRaw === 'situation' ||
    storedStepRaw === 'currentProfile'
  ) {
    void persistenceService.saveOnboardingStep('educationDetails');
  }

  if (authUser) {
    return '/(tabs)';
  }

  if (storedProfile?.completedAt) {
    if (offerAssessment) {
      return '/(tabs)/interview-simulator/onboarding-assessment';
    }
    return hasRegistered ? '/login' : '/signup';
  }

  if (storedProfile && storedStep && storedStep !== 'welcome') {
    return '/career-onboarding';
  }

  return '/onboarding';
}

export { persistenceService, careerProfileStore };
