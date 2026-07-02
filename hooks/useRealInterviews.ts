import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyGamification, subscribeGamification } from '@/utils/gamificationSync';

async function readCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.realInterviews);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'number' ? parsed : Number(parsed?.count ?? 0);
  } catch {
    return 0;
  }
}

async function writeCount(count: number): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.realInterviews, JSON.stringify({ count }));
}

export async function incrementRealInterviewCount(): Promise<void> {
  const count = await readCount();
  await writeCount(count + 1);
  notifyGamification();
}

export interface UseRealInterviewsReturn {
  realInterviewsCount: number;
  isReady: boolean;
  scheduleInterview: () => Promise<void>;
}

export function useRealInterviews(): UseRealInterviewsReturn {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    setCount(await readCount());
  }, []);

  useEffect(() => {
    let mounted = true;
    void readCount().then((stored) => {
      if (!mounted) return;
      setCount(stored);
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
    setCount(await readCount());
  }, []);

  return { realInterviewsCount: count, isReady, scheduleInterview };
}
