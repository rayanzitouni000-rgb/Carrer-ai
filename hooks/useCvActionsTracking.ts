import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';

interface CvActionsState {
  cvAnalyzedCount: number;
  cvGeneratedCount: number;
}

const DEFAULT_STATE: CvActionsState = {
  cvAnalyzedCount: 0,
  cvGeneratedCount: 0,
};

async function readState(): Promise<CvActionsState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.cvActionsTracking);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<CvActionsState>;
    return {
      cvAnalyzedCount: parsed.cvAnalyzedCount ?? 0,
      cvGeneratedCount: parsed.cvGeneratedCount ?? 0,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: CvActionsState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.cvActionsTracking, JSON.stringify(state));
}

async function mutateState(mutator: (state: CvActionsState) => CvActionsState): Promise<CvActionsState> {
  const current = await readState();
  const next = mutator(current);
  await writeState(next);
  return next;
}

export async function incrementCvAnalyzedCount(): Promise<void> {
  await mutateState((state) => ({
    ...state,
    cvAnalyzedCount: state.cvAnalyzedCount + 1,
  }));
}

export async function incrementCvGeneratedCount(): Promise<void> {
  await mutateState((state) => ({
    ...state,
    cvGeneratedCount: state.cvGeneratedCount + 1,
  }));
}

export interface UseCvActionsTrackingReturn {
  cvAnalyzedCount: number;
  cvGeneratedCount: number;
  isReady: boolean;
}

export function useCvActionsTracking(): UseCvActionsTrackingReturn {
  const [state, setState] = useState<CvActionsState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void readState().then((stored) => {
      if (!mounted) return;
      setState(stored);
      setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return {
    cvAnalyzedCount: state.cvAnalyzedCount,
    cvGeneratedCount: state.cvGeneratedCount,
    isReady,
  };
}
