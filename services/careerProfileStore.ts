import {
  CareerProfile,
  EMPTY_CAREER_PROFILE,
} from '@/features/career-onboarding/types';
import { normalizeCareerProfile } from '@/features/career-onboarding/skills/skillUtils';
import { persistenceService } from '@/services/persistence';
import { notifyGamification } from '@/utils/gamificationSync';

let profile: CareerProfile = { ...EMPTY_CAREER_PROFILE };
let hydrated = false;

export const careerProfileStore = {
  get(): CareerProfile {
    return profile;
  },

  set(next: CareerProfile): void {
    profile = normalizeCareerProfile(next);
    void persistenceService.saveCareerProfile(profile);
    notifyGamification();
  },

  update(partial: Partial<CareerProfile>): CareerProfile {
    profile = normalizeCareerProfile({ ...profile, ...partial });
    void persistenceService.saveCareerProfile(profile);
    notifyGamification();
    return profile;
  },

  reset(): void {
    profile = { ...EMPTY_CAREER_PROFILE };
    void persistenceService.clearCareerOnboarding();
  },

  resetInMemory(): void {
    profile = { ...EMPTY_CAREER_PROFILE };
    hydrated = true;
  },

  isComplete(): boolean {
    return profile.completedAt !== null;
  },

  async hydrate(): Promise<CareerProfile> {
    if (hydrated) return profile;
    const stored = await persistenceService.getCareerProfile();
    if (stored) {
      profile = normalizeCareerProfile(stored);
    }
    hydrated = true;
    return profile;
  },

  markHydrated(): void {
    hydrated = true;
  },
};
