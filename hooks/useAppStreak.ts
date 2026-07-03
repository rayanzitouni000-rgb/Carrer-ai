import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';

interface StreakState {
  currentStreakDays: number;
  lastOpenDate: string | null;
}

const DEFAULT_STATE: StreakState = {
  currentStreakDays: 0,
  lastOpenDate: null,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

async function readState(): Promise<StreakState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.appStreak);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    return {
      currentStreakDays: parsed.currentStreakDays ?? 0,
      lastOpenDate: parsed.lastOpenDate ?? null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: StreakState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.appStreak, JSON.stringify(state));
}

export async function recordAppOpen(): Promise<StreakState> {
  const current = await readState();
  const today = todayKey();

  if (current.lastOpenDate === today) {
    return current;
  }

  let nextStreak = 1;
  if (current.lastOpenDate === yesterdayKey()) {
    nextStreak = current.currentStreakDays + 1;
  }

  const next: StreakState = {
    currentStreakDays: nextStreak,
    lastOpenDate: today,
  };
  await writeState(next);
  return next;
}

export interface UseAppStreakReturn {
  currentStreakDays: number;
  isReady: boolean;
  recordAppOpen: () => Promise<void>;
}

export function useAppStreak(): UseAppStreakReturn {
  const [state, setState] = useState<StreakState>(DEFAULT_STATE);
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

  const handleRecordAppOpen = useCallback(async () => {
    const next = await recordAppOpen();
    setState(next);
  }, []);

  return {
    currentStreakDays: state.currentStreakDays,
    isReady,
    recordAppOpen: handleRecordAppOpen,
  };
}
