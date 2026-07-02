import { persistenceService } from '@/services/persistence';
import { authService } from '@/services/authService';
import { careerProfileStore } from '@/services/careerProfileStore';
import type { CareerOnboardingStep } from '@/features/career-onboarding/types';

export type BootstrapRoute =
  | '/(tabs)'
  | '/career-onboarding'
  | '/signup'
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
  const [session, storedProfile, storedStepRaw] = await Promise.all([
    persistenceService.getSession(),
    persistenceService.getCareerProfile(),
    persistenceService.getOnboardingStep(),
  ]);

  if (storedProfile) {
    careerProfileStore.set(storedProfile);
    careerProfileStore.markHydrated();
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

  if (session) {
    return '/(tabs)';
  }

  if (storedProfile?.completedAt) {
    const account = await persistenceService.getUserAccount();
    if (!account) {
      return '/signup';
    }
    return '/login';
  }

  if (storedProfile && storedStep && storedStep !== 'welcome') {
    return '/career-onboarding';
  }

  return '/onboarding';
}

export { authService, persistenceService, careerProfileStore };
