import { persistenceService } from '@/services/persistence';
import { careerProfileStore } from '@/services/careerProfileStore';
import { getAuthUserFromSession } from '@/hooks/useAuth';
import type { CareerOnboardingStep } from '@/features/career-onboarding/types';

export type BootstrapRoute =
  | '/(tabs)'
  | '/career-onboarding'
  | '/signup'
  | '/login'
  | '/onboarding';

function normalizeStoredStep(step: string | null): CareerOnboardingStep | null {
  if (!step) return null;
  if (step === 'target') return 'targetRole';
  if (step === 'education' || step === 'educationLevel' || step === 'situation' || step === 'currentProfile') {
    return 'educationDetails';
  }
  return step as CareerOnboardingStep;
}

export async function resolveBootstrapRoute(): Promise<BootstrapRoute> {
  const [authUser, storedProfile, storedStepRaw] = await Promise.all([
    getAuthUserFromSession(),
    persistenceService.getCareerProfile(),
    persistenceService.getOnboardingStep(),
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
    return '/login';
  }

  if (storedProfile && storedStep && storedStep !== 'welcome') {
    return '/career-onboarding';
  }

  return '/onboarding';
}

export { persistenceService, careerProfileStore };
