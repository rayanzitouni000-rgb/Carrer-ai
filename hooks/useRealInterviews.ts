import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyGamification, subscribeGamification } from '@/utils/gamificationSync';

export interface PendingRealInterview {
  company: string;
  jobTitle: string;
  createdAt: string;
}

interface RealInterviewState {
  count: number;
  pending: PendingRealInterview | null;
}

async function readState(): Promise<RealInterviewState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.realInterviews);
    if (!raw) return { count: 0, pending: null };
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'number') {
      return { count: parsed, pending: null };
    }
    return {
      count: Number(parsed?.count ?? 0),
      pending: parsed?.pending ?? null,
    };
  } catch {
    return { count: 0, pending: null };
  }
}

async function writeState(state: RealInterviewState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.realInterviews, JSON.stringify(state));
}

export async function incrementRealInterviewCount(): Promise<void> {
  const current = await readState();
  await writeState({ ...current, count: current.count + 1 });
  notifyGamification();
}

export interface UseRealInterviewsReturn {
  realInterviewsCount: number;
  pendingInterview: PendingRealInterview | null;
  isReady: boolean;
  scheduleInterview: () => Promise<void>;
  addInterview: (data: { company: string; jobTitle: string }) => Promise<void>;
}

export function useRealInterviews(): UseRealInterviewsReturn {
  const [state, setState] = useState<RealInterviewState>({ count: 0, pending: null });
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

  const scheduleInterview = useCallback(async () => {
    await incrementRealInterviewCount();
    setState(await readState());
  }, []);

  const addInterview = useCallback(async (data: { company: string; jobTitle: string }) => {
    const current = await readState();
    const next: RealInterviewState = {
      count: current.count + 1,
      pending: {
        company: data.company,
        jobTitle: data.jobTitle,
        createdAt: new Date().toISOString(),
      },
    };
    await writeState(next);
    notifyGamification();
    setState(next);
  }, []);

  return {
    realInterviewsCount: state.count,
    pendingInterview: state.pending,
    isReady,
    scheduleInterview,
    addInterview,
  };
}
