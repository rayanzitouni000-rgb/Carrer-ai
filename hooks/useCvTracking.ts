import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { CvSentEntry } from '@/types/cvTracking';
import { getCountByPeriod } from '@/utils/cvTrackingUtils';
import { notifyGamification } from '@/utils/gamificationSync';

export interface UseCvTrackingReturn {
  entries: CvSentEntry[];
  todayCount: number;
  weekCount: number;
  monthCount: number;
  isReady: boolean;
  addEntry: (note?: string) => void;
  removeEntry: (id: string) => void;
}

function createId(): string {
  return `cv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function readEntries(): Promise<CvSentEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.cvSentEntries);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CvSentEntry[]) : [];
  } catch {
    return [];
  }
}

function persistEntries(entries: CvSentEntry[]): void {
  void AsyncStorage.setItem(STORAGE_KEYS.cvSentEntries, JSON.stringify(entries));
  notifyGamification();
}

export function useCvTracking(): UseCvTrackingReturn {
  const [entries, setEntries] = useState<CvSentEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void readEntries().then((stored) => {
      if (!mounted) return;
      setEntries(stored);
      setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const addEntry = useCallback((note?: string) => {
    setEntries((prev) => {
      const trimmed = note?.trim();
      const entry: CvSentEntry = {
        id: createId(),
        date: new Date().toISOString(),
        ...(trimmed ? { note: trimmed } : {}),
      };
      const next = [entry, ...prev];
      persistEntries(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      persistEntries(next);
      return next;
    });
  }, []);

  const todayCount = useMemo(() => getCountByPeriod(entries, 'day'), [entries]);
  const weekCount = useMemo(() => getCountByPeriod(entries, 'week'), [entries]);
  const monthCount = useMemo(() => getCountByPeriod(entries, 'month'), [entries]);

  return {
    entries,
    todayCount,
    weekCount,
    monthCount,
    isReady,
    addEntry,
    removeEntry,
  };
}
