import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';
import type { CompanyBriefing, RealInterview } from '@/types/interviewSimulator';

interface RealInterviewState {
  count: number;
  interviews: RealInterview[];
}

const DEFAULT_STATE: RealInterviewState = {
  count: 0,
  interviews: [],
};

function normalizeLegacy(raw: unknown): RealInterviewState {
  if (!raw) return { ...DEFAULT_STATE };
  if (typeof raw === 'number') {
    return { count: raw, interviews: [] };
  }
  if (typeof raw === 'object' && raw !== null) {
    const parsed = raw as {
      count?: number;
      pending?: { company: string; jobTitle: string; createdAt: string };
      interviews?: RealInterview[];
    };
    const interviews = Array.isArray(parsed.interviews)
      ? parsed.interviews.map(withDerivedStatus)
      : [];
    if (parsed.pending && interviews.length === 0) {
      interviews.push({
        id: `legacy-${Date.now()}`,
        company: parsed.pending.company,
        jobTitle: parsed.pending.jobTitle,
        scheduledAt: parsed.pending.createdAt,
        status: 'upcoming',
      });
    }
    return {
      count: typeof parsed.count === 'number' ? parsed.count : interviews.length,
      interviews,
    };
  }
  return { ...DEFAULT_STATE };
}

async function readState(): Promise<RealInterviewState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.realInterviews);
    if (!raw) return { ...DEFAULT_STATE };
    return normalizeLegacy(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeState(state: RealInterviewState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.realInterviews, JSON.stringify(state));
  notifyCloudDataChanged();
}

export async function incrementRealInterviewCount(): Promise<void> {
  const current = await readState();
  await writeState({ ...current, count: current.count + 1 });
}

function createId(): string {
  return `ri-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function deriveStatus(scheduledAt: string): RealInterview['status'] {
  return new Date(scheduledAt).getTime() < Date.now() ? 'past' : 'upcoming';
}

function withDerivedStatus(interview: RealInterview): RealInterview {
  return { ...interview, status: deriveStatus(interview.scheduledAt) };
}

export interface UseRealInterviewsReturn {
  realInterviewsCount: number;
  interviews: RealInterview[];
  nextInterview: RealInterview | null;
  isReady: boolean;
  scheduleInterview: () => Promise<void>;
  addInterview: (data: {
    company: string;
    jobTitle: string;
    scheduledAt?: string;
    notes?: string;
    companyBriefing?: CompanyBriefing;
  }) => Promise<RealInterview>;
  updateInterview: (
    interviewId: string,
    patch: Partial<Pick<RealInterview, 'companyBriefing' | 'notes' | 'linkedSessionId' | 'jobTitle' | 'scheduledAt'>>
  ) => Promise<void>;
  linkSessionToInterview: (interviewId: string, sessionId: string) => Promise<void>;
}

export function useRealInterviews(): UseRealInterviewsReturn {
  const [state, setState] = useState<RealInterviewState>(DEFAULT_STATE);
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

  const nextInterview =
    state.interviews.find((item) => deriveStatus(item.scheduledAt) === 'upcoming') ?? null;

  const scheduleInterview = useCallback(async () => {
    await incrementRealInterviewCount();
    setState(await readState());
  }, []);

  const addInterview = useCallback(
    async (data: {
      company: string;
      jobTitle: string;
      scheduledAt?: string;
      notes?: string;
      companyBriefing?: CompanyBriefing;
    }) => {
      const current = await readState();
      const interview: RealInterview = {
        id: createId(),
        company: data.company,
        jobTitle: data.jobTitle,
        scheduledAt: data.scheduledAt ?? new Date().toISOString(),
        status: 'upcoming',
        ...(data.notes?.trim() ? { notes: data.notes.trim() } : {}),
        ...(data.companyBriefing ? { companyBriefing: data.companyBriefing } : {}),
      };
      const next: RealInterviewState = {
        count: current.count + 1,
        interviews: [interview, ...current.interviews],
      };
      await writeState(next);
      setState(next);
      return interview;
    },
    []
  );

  const updateInterview = useCallback(
    async (
      interviewId: string,
      patch: Partial<Pick<RealInterview, 'companyBriefing' | 'notes' | 'linkedSessionId' | 'jobTitle' | 'scheduledAt'>>
    ) => {
      const current = await readState();
      const next: RealInterviewState = {
        ...current,
        interviews: current.interviews.map((item) =>
          item.id === interviewId ? withDerivedStatus({ ...item, ...patch }) : item
        ),
      };
      await writeState(next);
      setState(next);
    },
    []
  );

  const linkSessionToInterview = useCallback(async (interviewId: string, sessionId: string) => {
    const current = await readState();
    const next: RealInterviewState = {
      ...current,
      interviews: current.interviews.map((item) =>
        item.id === interviewId ? { ...item, linkedSessionId: sessionId } : item
      ),
    };
    await writeState(next);
    setState(next);
  }, []);

  return {
    realInterviewsCount: state.count,
    interviews: state.interviews,
    nextInterview,
    isReady,
    scheduleInterview,
    addInterview,
    updateInterview,
    linkSessionToInterview,
  };
}

/** @deprecated Utiliser nextInterview */
export type PendingRealInterview = RealInterview;
