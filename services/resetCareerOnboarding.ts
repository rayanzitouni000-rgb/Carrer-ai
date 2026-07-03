import { EMPTY_CAREER_PROFILE } from '@/features/career-onboarding/types';

import { careerProfileStore } from './careerProfileStore';
import { persistenceService } from './persistence';
import { supabase } from '@/lib/supabaseClient';

export interface ResetCareerOnboardingOptions {
  /** Déconnecte aussi la session Supabase (utile pour retester tout le flux). */
  clearSession?: boolean;
}

/**
 * Efface le profil carrière + l'étape d'onboarding persistés,
 * puis remet le store mémoire à zéro.
 */
export async function resetCareerOnboarding(
  options: ResetCareerOnboardingOptions = {}
): Promise<void> {
  careerProfileStore.resetInMemory();
  await persistenceService.clearCareerOnboarding();

  if (options.clearSession) {
    await supabase.auth.signOut();
  }
}

export { EMPTY_CAREER_PROFILE };
