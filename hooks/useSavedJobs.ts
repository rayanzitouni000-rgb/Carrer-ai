import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';
import type { JobOffer, SavedJob } from '@/types/jobMatch';
import { getJobOfferById } from '@/utils/jobOfferResolver';
import { jobOfferStore } from '@/services/jobOfferStore';

interface JobMatchState {
  savedJobs: SavedJob[];
  jobApplicationsFromMatchCount: number;
}

const DEFAULT_STATE: JobMatchState = {
  savedJobs: [],
  jobApplicationsFromMatchCount: 0,
};

function isJobOffer(value: unknown): value is JobOffer {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    typeof (value as JobOffer).id === 'string'
  );
}

function normalizeSavedJobs(raw: unknown): SavedJob[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      if ('jobOffer' in item && isJobOffer((item as SavedJob).jobOffer)) {
        const saved = item as SavedJob;
        return {
          jobOffer: saved.jobOffer,
          savedAt: saved.savedAt ?? new Date().toISOString(),
        };
      }

      if ('jobOfferId' in item && typeof (item as { jobOfferId: string }).jobOfferId === 'string') {
        const legacy = item as { jobOfferId: string; savedAt?: string };
        const offer = getJobOfferById(legacy.jobOfferId);
        if (!offer) return null;
        return {
          jobOffer: offer,
          savedAt: legacy.savedAt ?? new Date().toISOString(),
        };
      }

      if ('id' in item && typeof (item as { id: string }).id === 'string') {
        const legacy = item as { id: string; savedAt?: string };
        const offer = getJobOfferById(legacy.id);
        if (!offer) return null;
        return {
          jobOffer: offer,
          savedAt: legacy.savedAt ?? new Date().toISOString(),
        };
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
  notifyCloudDataChanged();
}

export async function incrementJobApplicationFromMatch(): Promise<void> {
  const current = await readState();
  await writeState({
    ...current,
    jobApplicationsFromMatchCount: current.jobApplicationsFromMatchCount + 1,
  });
}

export interface UseSavedJobsReturn {
  savedJobs: SavedJob[];
  savedJobsCount: number;
  jobApplicationsFromMatchCount: number;
  isReady: boolean;
  isJobSaved: (jobOfferId: string) => boolean;
  toggleSaveJob: (offer: JobOffer) => void;
  trackApplicationFromMatch: () => Promise<void>;
}

export function useSavedJobs(): UseSavedJobsReturn {
  const [state, setState] = useState<JobMatchState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const reload = () => {
      void readState().then((stored) => {
        if (!mounted) return;
        stored.savedJobs.forEach((saved) => jobOfferStore.set(saved.jobOffer));
        setState(stored);
        setIsReady(true);
      });
    };
    reload();
    const unsub = subscribeCloudDataRefresh(reload);
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const isJobSaved = useCallback(
    (jobOfferId: string) => state.savedJobs.some((job) => job.jobOffer.id === jobOfferId),
    [state.savedJobs]
  );

  const toggleSaveJob = useCallback((offer: JobOffer) => {
    void (async () => {
      jobOfferStore.set(offer);
      const current = await readState();
      const exists = current.savedJobs.some((job) => job.jobOffer.id === offer.id);
      const next: JobMatchState = {
        ...current,
        savedJobs: exists
          ? current.savedJobs.filter((job) => job.jobOffer.id !== offer.id)
          : [{ jobOffer: offer, savedAt: new Date().toISOString() }, ...current.savedJobs],
      };
      await writeState(next);
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
