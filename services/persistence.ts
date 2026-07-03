import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { CareerOnboardingStep, CareerProfile } from '@/features/career-onboarding/types';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const persistenceService = {
  async getCareerProfile(): Promise<CareerProfile | null> {
    return readJson<CareerProfile>(STORAGE_KEYS.careerProfile);
  },

  async saveCareerProfile(profile: CareerProfile): Promise<void> {
    await writeJson(STORAGE_KEYS.careerProfile, profile);
    notifyCloudDataChanged();
  },

  async getOnboardingStep(): Promise<CareerOnboardingStep | null> {
    return readJson<CareerOnboardingStep>(STORAGE_KEYS.onboardingStep);
  },

  async saveOnboardingStep(step: CareerOnboardingStep): Promise<void> {
    await writeJson(STORAGE_KEYS.onboardingStep, step);
    notifyCloudDataChanged();
  },

  async clearCareerOnboarding(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.careerProfile,
      STORAGE_KEYS.onboardingStep,
    ]);
  },
};
