import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { notifyCloudDataChanged } from '@/services/cloudSyncNotify';
import { subscribeCloudDataRefresh } from '@/services/cloudSyncEvents';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import {
  FREE_CHAT_MESSAGES_PER_DAY,
  FREE_INTERVIEW_SESSIONS_PER_MONTH,
  type UsageLimits,
} from '@/types/premium';

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getCurrentDayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function createDefaultLimits(): UsageLimits {
  return {
    interviewSessionsThisMonth: 0,
    chatMessagesToday: 0,
    lastResetMonth: getCurrentMonthKey(),
    lastResetDay: getCurrentDayKey(),
  };
}

function applyResets(limits: UsageLimits): UsageLimits {
  const currentMonth = getCurrentMonthKey();
  const currentDay = getCurrentDayKey();
  let next = { ...limits };

  if (next.lastResetMonth !== currentMonth) {
    next = {
      ...next,
      interviewSessionsThisMonth: 0,
      lastResetMonth: currentMonth,
    };
  }

  if (next.lastResetDay !== currentDay) {
    next = {
      ...next,
      chatMessagesToday: 0,
      lastResetDay: currentDay,
    };
  }

  return next;
}

async function readLimits(): Promise<UsageLimits> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.usageLimits);
    if (!raw) return createDefaultLimits();
    const parsed = JSON.parse(raw) as Partial<UsageLimits>;
    const merged: UsageLimits = {
      interviewSessionsThisMonth:
        typeof parsed.interviewSessionsThisMonth === 'number'
          ? parsed.interviewSessionsThisMonth
          : 0,
      chatMessagesToday:
        typeof parsed.chatMessagesToday === 'number' ? parsed.chatMessagesToday : 0,
      lastResetMonth:
        typeof parsed.lastResetMonth === 'string' ? parsed.lastResetMonth : getCurrentMonthKey(),
      lastResetDay:
        typeof parsed.lastResetDay === 'string' ? parsed.lastResetDay : getCurrentDayKey(),
    };
    return applyResets(merged);
  } catch {
    return createDefaultLimits();
  }
}

async function writeLimits(limits: UsageLimits): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.usageLimits, JSON.stringify(limits));
  notifyCloudDataChanged();
}

export interface UseUsageLimitsReturn {
  interviewSessionsThisMonth: number;
  chatMessagesToday: number;
  canStartInterviewSession: boolean;
  canSendChatMessage: boolean;
  isReady: boolean;
  incrementInterviewSessions: () => Promise<void>;
  incrementChatMessages: () => Promise<void>;
}

export function useUsageLimits(): UseUsageLimitsReturn {
  const { isPremium } = usePremiumStatus();
  const [limits, setLimits] = useState<UsageLimits>(createDefaultLimits);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void readLimits().then((stored) => {
      if (!mounted) return;
      setLimits(stored);
      setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const canStartInterviewSession = useMemo(
    () => isPremium || limits.interviewSessionsThisMonth < FREE_INTERVIEW_SESSIONS_PER_MONTH,
    [isPremium, limits.interviewSessionsThisMonth]
  );

  const canSendChatMessage = useMemo(
    () => isPremium || limits.chatMessagesToday < FREE_CHAT_MESSAGES_PER_DAY,
    [isPremium, limits.chatMessagesToday]
  );

  const incrementInterviewSessions = useCallback(async () => {
    const current = applyResets(await readLimits());
    const next: UsageLimits = {
      ...current,
      interviewSessionsThisMonth: current.interviewSessionsThisMonth + 1,
    };
    await writeLimits(next);
    setLimits(next);
  }, []);

  const incrementChatMessages = useCallback(async () => {
    const current = applyResets(await readLimits());
    const next: UsageLimits = {
      ...current,
      chatMessagesToday: current.chatMessagesToday + 1,
    };
    await writeLimits(next);
    setLimits(next);
  }, []);

  return {
    interviewSessionsThisMonth: limits.interviewSessionsThisMonth,
    chatMessagesToday: limits.chatMessagesToday,
    canStartInterviewSession,
    canSendChatMessage,
    isReady,
    incrementInterviewSessions,
    incrementChatMessages,
  };
}
