import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';
import type { ApplicationEntry } from '@/types/applicationTracking';
import { getCountByPeriod } from '@/utils/applicationTrackingUtils';

/** Ancien format stocké sous @careerpilot/cv-sent-entries (CV Manager manuel). */
interface LegacyCvSentEntry {
  id: string;
  date: string;
  note?: string;
}

export interface UseApplicationTrackingReturn {
  entries: ApplicationEntry[];
  todayCount: number;
  weekCount: number;
  monthCount: number;
  isReady: boolean;
  addApplication: (data: {
    company: string;
    jobTitle: string;
    jobOfferId?: string;
  }) => void;
  removeApplication: (id: string) => void;
  hasAppliedToJob: (jobOfferId: string) => boolean;
}

function createId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseApplicationEntries(raw: unknown): ApplicationEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is ApplicationEntry =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ApplicationEntry).id === 'string' &&
      typeof (item as ApplicationEntry).date === 'string' &&
      typeof (item as ApplicationEntry).company === 'string' &&
      typeof (item as ApplicationEntry).jobTitle === 'string' &&
      ((item as ApplicationEntry).source === 'job_match' ||
        (item as ApplicationEntry).source === 'manual')
  );
}

function migrateLegacyEntry(entry: LegacyCvSentEntry): ApplicationEntry {
  let company = '';
  let jobTitle = '';

  if (entry.note?.includes(' — ')) {
    const [parsedCompany, ...rest] = entry.note.split(' — ');
    company = parsedCompany?.trim() ?? '';
    jobTitle = rest.join(' — ').trim();
  } else if (entry.note) {
    jobTitle = entry.note.trim();
  }

  return {
    id: entry.id,
    date: entry.date,
    company,
    jobTitle,
    source: 'manual',
  };
}

function migrateLegacyEntries(raw: unknown): ApplicationEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is LegacyCvSentEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as LegacyCvSentEntry).id === 'string' &&
        typeof (item as LegacyCvSentEntry).date === 'string'
    )
    .map(migrateLegacyEntry);
}

/**
 * Nouvelle clé : applicationEntries.
 * Migration automatique depuis cvSentEntries (@careerpilot/cv-sent-entries)
 * au premier chargement si la nouvelle clé est vide.
 */
async function readEntries(): Promise<ApplicationEntry[]> {
  try {
    const currentRaw = await AsyncStorage.getItem(STORAGE_KEYS.applicationEntries);
    if (currentRaw !== null) {
      return parseApplicationEntries(JSON.parse(currentRaw));
    }

    const legacyRaw = await AsyncStorage.getItem(STORAGE_KEYS.cvSentEntries);
    if (!legacyRaw) return [];

    const migrated = migrateLegacyEntries(JSON.parse(legacyRaw));
    if (migrated.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.applicationEntries, JSON.stringify(migrated));
      await AsyncStorage.removeItem(STORAGE_KEYS.cvSentEntries);
    }
    return migrated;
  } catch {
    return [];
  }
}

function persistEntries(entries: ApplicationEntry[]): void {
  void AsyncStorage.setItem(STORAGE_KEYS.applicationEntries, JSON.stringify(entries));
  notifyCloudDataChanged();
}

export function useApplicationTracking(): UseApplicationTrackingReturn {
  const [entries, setEntries] = useState<ApplicationEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const reload = () => {
      void readEntries().then((stored) => {
        if (!mounted) return;
        setEntries(stored);
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

  const hasAppliedToJob = useCallback(
    (jobOfferId: string) => entries.some((entry) => entry.jobOfferId === jobOfferId),
    [entries]
  );

  const addApplication = useCallback(
    (data: { company: string; jobTitle: string; jobOfferId?: string }) => {
      setEntries((prev) => {
        if (data.jobOfferId && prev.some((entry) => entry.jobOfferId === data.jobOfferId)) {
          return prev;
        }

        const entry: ApplicationEntry = {
          id: createId(),
          date: new Date().toISOString(),
          company: data.company.trim(),
          jobTitle: data.jobTitle.trim(),
          ...(data.jobOfferId ? { jobOfferId: data.jobOfferId } : {}),
          source: data.jobOfferId ? 'job_match' : 'manual',
        };
        const next = [entry, ...prev];
        persistEntries(next);
        return next;
      });
    },
    []
  );

  const removeApplication = useCallback((id: string) => {
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
    addApplication,
    removeApplication,
    hasAppliedToJob,
  };
}
