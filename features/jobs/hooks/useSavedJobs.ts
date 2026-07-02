import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyGamification, subscribeGamification } from '@/utils/gamificationSync';

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  savedAt: string;
}

interface JobMatchState {
  savedJobs: SavedJob[];
  jobApplicationsFromMatchCount: number;
}

const DEFAULT_STATE: JobMatchState = {
  savedJobs: [],
  jobApplicationsFromMatchCount: 0,
};

async function readState(): Promise<JobMatchState> {
  try {
    const [savedRaw, appsRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.savedJobs),
      AsyncStorage.getItem(STORAGE_KEYS.jobMatchApplications),
    ]);
    const savedJobs = savedRaw ? (JSON.parse(savedRaw) as SavedJob[]) : [];
    const jobApplicationsFromMatchCount = appsRaw ? Number(JSON.parse(appsRaw)) : 0;
    return {
      savedJobs: Array.isArray(savedJobs) ? savedJobs : [],
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
  saveJob: (job: Omit<SavedJob, 'savedAt'>) => Promise<void>;
  removeSavedJob: (id: string) => Promise<void>;
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

  const saveJob = useCallback(async (job: Omit<SavedJob, 'savedAt'>) => {
    const current = await readState();
    if (current.savedJobs.some((item) => item.id === job.id)) return;
    const next: JobMatchState = {
      ...current,
      savedJobs: [{ ...job, savedAt: new Date().toISOString() }, ...current.savedJobs],
    };
    await writeState(next);
    notifyGamification();
    setState(next);
  }, []);

  const removeSavedJob = useCallback(async (id: string) => {
    const current = await readState();
    const next: JobMatchState = {
      ...current,
      savedJobs: current.savedJobs.filter((job) => job.id !== id),
    };
    await writeState(next);
    notifyGamification();
    setState(next);
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
    saveJob,
    removeSavedJob,
    trackApplicationFromMatch,
  };
}

/** Alias prévu pour la future couche recherche Job Match. */
export function useJobSearch() {
  const saved = useSavedJobs();
  return {
    ...saved,
    isSearching: false,
    query: '',
  };
}
