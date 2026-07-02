import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { SavedJob } from '@/types/jobMatch';
import { notifyGamification, subscribeGamification } from '@/utils/gamificationSync';

interface JobMatchState {
  savedJobs: SavedJob[];
  jobApplicationsFromMatchCount: number;
}

const DEFAULT_STATE: JobMatchState = {
  savedJobs: [],
  jobApplicationsFromMatchCount: 0,
};

function normalizeSavedJobs(raw: unknown): SavedJob[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (item && typeof item === 'object' && 'jobOfferId' in item) {
        return item as SavedJob;
      }
      if (item && typeof item === 'object' && 'id' in item) {
        const legacy = item as { id: string; savedAt?: string };
        return { jobOfferId: legacy.id, savedAt: legacy.savedAt ?? new Date().toISOString() };
      }
      return null;
    })
    .filter((item): item is SavedJob => item !== null);
}

async function readState(): Promise<JobMatchState> {
  try {
    const [savedRaw, appsRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.savedJobs),
      AsyncStorage.getItem(STORAGE_KEYS.jobMatchApplications),
    ]);
    const savedJobs = savedRaw ? normalizeSavedJobs(JSON.parse(savedRaw)) : [];
    const jobApplicationsFromMatchCount = appsRaw ? Number(JSON.parse(appsRaw)) : 0;
    return {
      savedJobs,
      jobApplicationsFromMatchCount: Number.isFinite(jobApplicationsFromMatchCount)
        ? jobApplicationsFromMatchCount
        : 0,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: JobMatchState): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.savedJobs, JSON.stringify(state.savedJobs)),
    AsyncStorage.setItem(
      STORAGE_KEYS.jobMatchApplications,
      JSON.stringify(state.jobApplicationsFromMatchCount)
    ),
  ]);
}

export async function incrementJobApplicationFromMatch(): Promise<void> {
  const current = await readState();
  await writeState({
    ...current,
    jobApplicationsFromMatchCount: current.jobApplicationsFromMatchCount + 1,
  });
  notifyGamification();
}

export interface UseSavedJobsReturn {
  savedJobs: SavedJob[];
  savedJobsCount: number;
  jobApplicationsFromMatchCount: number;
  isReady: boolean;
  isJobSaved: (jobOfferId: string) => boolean;
  toggleSaveJob: (jobOfferId: string) => void;
  trackApplicationFromMatch: () => Promise<void>;
}

export function useSavedJobs(): UseSavedJobsReturn {
  const [state, setState] = useState<JobMatchState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    setState(await readState());
  }, []);

  useEffect(() => {
    let mounted = true;
    void readState().then((stored) => {
      if (!mounted) return;
      setState(stored);
      setIsReady(true);
    });
    const unsubscribe = subscribeGamification(() => {
      void refresh();
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refresh]);

  const isJobSaved = useCallback(
    (jobOfferId: string) => state.savedJobs.some((job) => job.jobOfferId === jobOfferId),
    [state.savedJobs]
  );

  const toggleSaveJob = useCallback((jobOfferId: string) => {
    void (async () => {
      const current = await readState();
      const exists = current.savedJobs.some((job) => job.jobOfferId === jobOfferId);
      const next: JobMatchState = {
        ...current,
        savedJobs: exists
          ? current.savedJobs.filter((job) => job.jobOfferId !== jobOfferId)
          : [{ jobOfferId, savedAt: new Date().toISOString() }, ...current.savedJobs],
      };
      await writeState(next);
      notifyGamification();
      setState(next);
    })();
  }, []);

  const trackApplicationFromMatch = useCallback(async () => {
    await incrementJobApplicationFromMatch();
    setState(await readState());
  }, []);

  return {
    savedJobs: state.savedJobs,
    savedJobsCount: state.savedJobs.length,
    jobApplicationsFromMatchCount: state.jobApplicationsFromMatchCount,
    isReady,
    isJobSaved,
    toggleSaveJob,
    trackApplicationFromMatch,
  };
}
