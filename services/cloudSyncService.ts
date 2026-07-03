import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { CareerOnboardingStep, CareerProfile } from '@/features/career-onboarding/types';
import { normalizeCareerProfile } from '@/features/career-onboarding/skills/skillUtils';
import { supabase } from '@/lib/supabaseClient';
import { careerProfileStore } from '@/services/careerProfileStore';
import { emitCloudDataRefresh } from '@/services/cloudSyncEvents';
import { persistenceService } from '@/services/persistence';
import {
  createEmptyCloudSnapshot,
  USER_CLOUD_SNAPSHOT_VERSION,
  type UserCloudSnapshot,
} from '@/types/userCloudSnapshot';

const PUSH_DEBOUNCE_MS = 2000;

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let activeUserId: string | null = null;
let isApplyingRemote = false;

export function isCloudSyncApplyingRemote(): boolean {
  return isApplyingRemote;
}

async function readJsonKey(key: string): Promise<unknown> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function writeJsonKey(key: string, value: unknown): Promise<void> {
  if (value === null || value === undefined) {
    await AsyncStorage.removeItem(key);
    return;
  }
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function collectLocalSnapshot(): Promise<UserCloudSnapshot> {
  const [
    careerProfile,
    onboardingStep,
    savedJobs,
    jobMatchApplications,
    applicationEntries,
    cvActionsTracking,
    interviewSessions,
    realInterviews,
    jobSearchPreferences,
    onboardingAssessment,
    usageLimits,
    aiChatHistory,
    appStreak,
    premiumStatus,
  ] = await Promise.all([
    persistenceService.getCareerProfile(),
    persistenceService.getOnboardingStep(),
    readJsonKey(STORAGE_KEYS.savedJobs),
    readJsonKey(STORAGE_KEYS.jobMatchApplications),
    readJsonKey(STORAGE_KEYS.applicationEntries),
    readJsonKey(STORAGE_KEYS.cvActionsTracking),
    readJsonKey(STORAGE_KEYS.interviewSessions),
    readJsonKey(STORAGE_KEYS.realInterviews),
    readJsonKey(STORAGE_KEYS.jobSearchPreferences),
    readJsonKey(STORAGE_KEYS.onboardingAssessment),
    readJsonKey(STORAGE_KEYS.usageLimits),
    readJsonKey(STORAGE_KEYS.aiChatHistory),
    readJsonKey(STORAGE_KEYS.appStreak),
    readJsonKey(STORAGE_KEYS.premiumStatusSimulated),
  ]);

  return {
    version: USER_CLOUD_SNAPSHOT_VERSION,
    careerProfile,
    onboardingStep,
    savedJobs: savedJobs ?? [],
    jobMatchApplications:
      typeof jobMatchApplications === 'number'
        ? jobMatchApplications
        : Number(jobMatchApplications) || 0,
    applicationEntries: applicationEntries ?? [],
    cvActionsTracking: cvActionsTracking ?? { cvAnalyzedCount: 0, cvGeneratedCount: 0 },
    interviewSessions: interviewSessions ?? { sessions: [], count: 0 },
    realInterviews: realInterviews ?? { count: 0, interviews: [] },
    jobSearchPreferences,
    onboardingAssessment: onboardingAssessment ?? createEmptyCloudSnapshot().onboardingAssessment,
    usageLimits,
    aiChatHistory,
    appStreak: appStreak ?? { currentStreakDays: 0, lastOpenDate: null },
    premiumStatus,
  };
}

export async function applyRemoteSnapshot(snapshot: UserCloudSnapshot): Promise<void> {
  isApplyingRemote = true;
  try {
  const writes: Promise<void>[] = [
    writeJsonKey(STORAGE_KEYS.savedJobs, snapshot.savedJobs),
    writeJsonKey(STORAGE_KEYS.jobMatchApplications, snapshot.jobMatchApplications),
    writeJsonKey(STORAGE_KEYS.applicationEntries, snapshot.applicationEntries),
    writeJsonKey(STORAGE_KEYS.cvActionsTracking, snapshot.cvActionsTracking),
    writeJsonKey(STORAGE_KEYS.interviewSessions, snapshot.interviewSessions),
    writeJsonKey(STORAGE_KEYS.realInterviews, snapshot.realInterviews),
    writeJsonKey(STORAGE_KEYS.onboardingAssessment, snapshot.onboardingAssessment),
    writeJsonKey(STORAGE_KEYS.usageLimits, snapshot.usageLimits),
    writeJsonKey(STORAGE_KEYS.aiChatHistory, snapshot.aiChatHistory),
    writeJsonKey(STORAGE_KEYS.appStreak, snapshot.appStreak),
    writeJsonKey(STORAGE_KEYS.premiumStatusSimulated, snapshot.premiumStatus),
  ];

  if (snapshot.jobSearchPreferences) {
    writes.push(writeJsonKey(STORAGE_KEYS.jobSearchPreferences, snapshot.jobSearchPreferences));
  }

  if (snapshot.onboardingStep) {
    writes.push(persistenceService.saveOnboardingStep(snapshot.onboardingStep as CareerOnboardingStep));
  }

  if (snapshot.careerProfile) {
    const normalized = normalizeCareerProfile(snapshot.careerProfile);
    careerProfileStore.set(normalized);
    writes.push(persistenceService.saveCareerProfile(normalized));
  }

  await Promise.all(writes);
  emitCloudDataRefresh();
  } finally {
    isApplyingRemote = false;
  }
}

async function getLastSyncTime(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.lastCloudSync);
}

async function setLastSyncTime(iso: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.lastCloudSync, iso);
}

export async function pushSnapshotToCloud(userId: string, snapshot?: UserCloudSnapshot): Promise<void> {
  const profileData = snapshot ?? (await collectLocalSnapshot());
  const now = new Date().toISOString();

  const { error } = await supabase.from('career_profiles').upsert(
    {
      user_id: userId,
      profile_data: profileData,
      updated_at: now,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.warn('[CloudSync] push failed:', error.message);
    return;
  }

  await setLastSyncTime(now);
}

async function pullSnapshotFromCloud(
  userId: string
): Promise<{ snapshot: UserCloudSnapshot; updatedAt: string } | null> {
  const { data, error } = await supabase
    .from('career_profiles')
    .select('profile_data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[CloudSync] pull failed:', error.message);
    return null;
  }

  if (!data?.profile_data) return null;

  const snapshot = data.profile_data as UserCloudSnapshot;
  if (snapshot.version !== USER_CLOUD_SNAPSHOT_VERSION) {
    return { snapshot: { ...createEmptyCloudSnapshot(), ...snapshot }, updatedAt: data.updated_at };
  }

  return { snapshot, updatedAt: data.updated_at };
}

/** Synchronise au login : remote récent → local, sinon push local vers le cloud. */
export async function syncUserDataForAuth(userId: string): Promise<void> {
  activeUserId = userId;

  try {
    const localSnapshot = await collectLocalSnapshot();
    const lastSync = await getLastSyncTime();
    const remote = await pullSnapshotFromCloud(userId);

    if (!remote) {
      await pushSnapshotToCloud(userId, localSnapshot);
      return;
    }

    const remoteTime = new Date(remote.updatedAt).getTime();
    const localSyncTime = lastSync ? new Date(lastSync).getTime() : 0;

    if (remoteTime > localSyncTime) {
      await applyRemoteSnapshot(remote.snapshot);
      await setLastSyncTime(remote.updatedAt);
      return;
    }

    await pushSnapshotToCloud(userId, localSnapshot);
  } catch (error) {
    console.warn('[CloudSync] syncUserDataForAuth error:', error);
  }
}

export function scheduleCloudPush(userId?: string | null): void {
  const id = userId ?? activeUserId;
  if (!id) return;

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushSnapshotToCloud(id);
  }, PUSH_DEBOUNCE_MS);
}

export function clearCloudSyncUser(): void {
  activeUserId = null;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
}

export async function flushCloudPush(userId?: string | null): Promise<void> {
  const id = userId ?? activeUserId;
  if (!id) return;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  await pushSnapshotToCloud(id);
}
