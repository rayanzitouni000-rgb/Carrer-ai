import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';

interface AssessmentState {
  hasCompletedAssessment: boolean;
  hasSkippedAssessment: boolean;
  lastAssessmentScore: number | null;
}

const DEFAULT_STATE: AssessmentState = {
  hasCompletedAssessment: false,
  hasSkippedAssessment: false,
  lastAssessmentScore: null,
};

async function readState(): Promise<AssessmentState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.onboardingAssessment);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AssessmentState>;
    return {
      hasCompletedAssessment: Boolean(parsed.hasCompletedAssessment),
      hasSkippedAssessment: Boolean(parsed.hasSkippedAssessment),
      lastAssessmentScore:
        typeof parsed.lastAssessmentScore === 'number' ? parsed.lastAssessmentScore : null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: AssessmentState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingAssessment, JSON.stringify(state));
  notifyCloudDataChanged();
}

export interface UseOnboardingAssessmentReturn {
  hasCompletedAssessment: boolean;
  hasSkippedAssessment: boolean;
  lastAssessmentScore: number | null;
  isReady: boolean;
  markAssessmentDone: (score: number) => Promise<void>;
  markAssessmentSkipped: () => Promise<void>;
  shouldOfferAssessmentAfterWizard: () => Promise<boolean>;
}

export function useOnboardingAssessment(): UseOnboardingAssessmentReturn {
  const [state, setState] = useState<AssessmentState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const reload = () => {
      void readState().then((stored) => {
        if (!mounted) return;
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

  const markAssessmentDone = useCallback(async (score: number) => {
    const next: AssessmentState = {
      hasCompletedAssessment: true,
      hasSkippedAssessment: false,
      lastAssessmentScore: score,
    };
    await writeState(next);
    setState(next);
  }, []);

  const markAssessmentSkipped = useCallback(async () => {
    const current = await readState();
    const next: AssessmentState = {
      ...current,
      hasSkippedAssessment: true,
    };
    await writeState(next);
    setState(next);
  }, []);

  const shouldOfferAssessmentAfterWizard = useCallback(async () => {
    const current = await readState();
    return !current.hasCompletedAssessment && !current.hasSkippedAssessment;
  }, []);

  return {
    hasCompletedAssessment: state.hasCompletedAssessment,
    hasSkippedAssessment: state.hasSkippedAssessment,
    lastAssessmentScore: state.lastAssessmentScore,
    isReady,
    markAssessmentDone,
    markAssessmentSkipped,
    shouldOfferAssessmentAfterWizard,
  };
}
