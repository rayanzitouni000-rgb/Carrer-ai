import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import {
  DEFAULT_JOB_SEARCH_PREFERENCES,
  type JobSearchPreferences,
} from '@/types/jobMatch';

const listeners = new Set<() => void>();

function notifyJobSearchPreferences() {
  listeners.forEach((listener) => listener());
}

async function readPreferences(): Promise<JobSearchPreferences> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.jobSearchPreferences);
    if (!raw) return { ...DEFAULT_JOB_SEARCH_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<JobSearchPreferences>;
    return {
      ...DEFAULT_JOB_SEARCH_PREFERENCES,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_JOB_SEARCH_PREFERENCES };
  }
}

async function writePreferences(preferences: JobSearchPreferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.jobSearchPreferences, JSON.stringify(preferences));
}

export interface UseJobSearchPreferencesReturn {
  preferences: JobSearchPreferences;
  isReady: boolean;
  hasBeenSet: boolean;
  setLocation: (location: string, label: string, radius: number) => Promise<void>;
  skipLocationSetup: () => Promise<void>;
}

export function useJobSearchPreferences(): UseJobSearchPreferencesReturn {
  const [preferences, setPreferences] = useState<JobSearchPreferences>(DEFAULT_JOB_SEARCH_PREFERENCES);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    setPreferences(await readPreferences());
  }, []);

  useEffect(() => {
    let mounted = true;
    void readPreferences().then((stored) => {
      if (!mounted) return;
      setPreferences(stored);
      setIsReady(true);
    });
    listeners.add(refresh);
    return () => {
      mounted = false;
      listeners.delete(refresh);
    };
  }, [refresh]);

  const setLocation = useCallback(async (location: string, label: string, radius: number) => {
    const next: JobSearchPreferences = {
      location: location.trim(),
      locationLabel: label.trim() || location.trim(),
      radius,
      hasBeenSet: true,
    };
    await writePreferences(next);
    setPreferences(next);
    notifyJobSearchPreferences();
  }, []);

  const skipLocationSetup = useCallback(async () => {
    const next: JobSearchPreferences = {
      location: '',
      locationLabel: '',
      radius: 9999,
      hasBeenSet: true,
    };
    await writePreferences(next);
    setPreferences(next);
    notifyJobSearchPreferences();
  }, []);

  return {
    preferences,
    isReady,
    hasBeenSet: preferences.hasBeenSet,
    setLocation,
    skipLocationSetup,
  };
}
