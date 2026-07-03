import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';
import type { InterviewSession } from '@/types/interviewSimulator';

interface StoredInterviewHistory {
  sessions: InterviewSession[];
  count: number;
}

const DEFAULT_STATE: StoredInterviewHistory = {
  sessions: [],
  count: 0,
};

function normalizeStored(raw: unknown): StoredInterviewHistory {
  if (!raw) return { ...DEFAULT_STATE };
  if (typeof raw === 'number') {
    return { sessions: [], count: raw };
  }
  if (typeof raw === 'object' && raw !== null) {
    const parsed = raw as Partial<StoredInterviewHistory>;
    const sessions = Array.isArray(parsed.sessions) ? (parsed.sessions as InterviewSession[]) : [];
    const count = typeof parsed.count === 'number' ? parsed.count : sessions.length;
    return { sessions, count };
  }
  return { ...DEFAULT_STATE };
}

async function readState(): Promise<StoredInterviewHistory> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.interviewSessions);
    if (!raw) return { ...DEFAULT_STATE };
    return normalizeStored(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: StoredInterviewHistory): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.interviewSessions, JSON.stringify(state));
  notifyCloudDataChanged();
}

export async function incrementInterviewSessionCount(): Promise<void> {
  const current = await readState();
  await writeState({ ...current, count: current.count + 1 });
}

export interface UseInterviewHistoryReturn {
  sessions: InterviewSession[];
  interviewSessionsCount: number;
  isReady: boolean;
  saveSession: (session: InterviewSession) => Promise<void>;
  getSessionById: (id: string) => InterviewSession | undefined;
}

export function useInterviewHistory(): UseInterviewHistoryReturn {
  const [state, setState] = useState<StoredInterviewHistory>(DEFAULT_STATE);
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

  const saveSession = useCallback(async (session: InterviewSession) => {
    const current = await readState();
    const next: StoredInterviewHistory = {
      sessions: [session, ...current.sessions.filter((item) => item.id !== session.id)],
      count: current.count + 1,
    };
    await writeState(next);
    setState(next);
  }, []);

  const getSessionById = useCallback(
    (id: string) => state.sessions.find((session) => session.id === id),
    [state.sessions]
  );

  return {
    sessions: state.sessions,
    interviewSessionsCount: state.count,
    isReady,
    saveSession,
    getSessionById,
  };
}
