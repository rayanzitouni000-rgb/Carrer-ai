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

interface CloudSyncMeta {
  userId: string;
  syncedAt: string;
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let activeUserId: string | null = null;
let isApplyingRemote = false;

export function isCloudSyncApplyingRemote(): boolean {
  return isApplyingRemote;
}

export function setActiveCloudUserId(userId: string | null): void {
  activeUserId = userId;
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

async function getSyncMeta(): Promise<CloudSyncMeta | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.cloudSyncMeta);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CloudSyncMeta>;
    if (typeof parsed.userId === 'string' && typeof parsed.syncedAt === 'string') {
      return { userId: parsed.userId, syncedAt: parsed.syncedAt };
    }
    return null;
  } catch {
    return null;
  }
}

async function setSyncMeta(userId: string, syncedAt: string): Promise<void> {
  const meta: CloudSyncMeta = { userId, syncedAt };
  await AsyncStorage.setItem(STORAGE_KEYS.cloudSyncMeta, JSON.stringify(meta));
}

/** Efface toutes les données locales liées au profil (changement de compte / déconnexion). */
export async function clearLocalUserData(): Promise<void> {
  careerProfileStore.resetInMemory();
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.careerProfile,
    STORAGE_KEYS.onboardingStep,
    STORAGE_KEYS.savedJobs,
    STORAGE_KEYS.jobMatchApplications,
    STORAGE_KEYS.applicationEntries,
    STORAGE_KEYS.cvSentEntries,
    STORAGE_KEYS.cvActionsTracking,
    STORAGE_KEYS.interviewSessions,
    STORAGE_KEYS.realInterviews,
    STORAGE_KEYS.jobSearchPreferences,
    STORAGE_KEYS.onboardingAssessment,
    STORAGE_KEYS.usageLimits,
    STORAGE_KEYS.aiChatHistory,
    STORAGE_KEYS.appStreak,
    STORAGE_KEYS.premiumStatusSimulated,
    STORAGE_KEYS.cloudSyncMeta,
    STORAGE_KEYS.lastCloudSync,
    STORAGE_KEYS.hasRegisteredAccount,
  ]);
  emitCloudDataRefresh();
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
      writes.push(
        persistenceService.saveOnboardingStep(snapshot.onboardingStep as CareerOnboardingStep)
      );
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

async function verifySessionUserId(expectedUserId: string): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id === expectedUserId;
}

export async function pushSnapshotToCloud(
  userId: string,
  snapshot?: UserCloudSnapshot
): Promise<boolean> {
  const sessionOk = await verifySessionUserId(userId);
  if (!sessionOk) {
    console.warn('[CloudSync] push ignoré — session absente ou utilisateur différent');
    return false;
  }

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
    console.warn('[CloudSync] push failed:', error.message, error.code);
    return false;
  }

  await setSyncMeta(userId, now);
  return true;
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
    console.warn('[CloudSync] pull failed:', error.message, error.code);
    return null;
  }

  if (!data?.profile_data) return null;

  const snapshot = data.profile_data as UserCloudSnapshot;
  if (snapshot.version !== USER_CLOUD_SNAPSHOT_VERSION) {
    return { snapshot: { ...createEmptyCloudSnapshot(), ...snapshot }, updatedAt: data.updated_at };
  }

  return { snapshot, updatedAt: data.updated_at };
}

/** Synchronise au login : isole les données par utilisateur. */
export async function syncUserDataForAuth(userId: string): Promise<void> {
  activeUserId = userId;

  try {
    const meta = await getSyncMeta();
    const isDifferentUser = Boolean(meta?.userId && meta.userId !== userId);
    const remote = await pullSnapshotFromCloud(userId);

    if (isDifferentUser) {
      await clearLocalUserData();
      if (remote) {
        await applyRemoteSnapshot(remote.snapshot);
        await setSyncMeta(userId, remote.updatedAt);
      } else {
        await setSyncMeta(userId, new Date().toISOString());
      }
      return;
    }

    const localSnapshot = await collectLocalSnapshot();

    if (!remote) {
      await pushSnapshotToCloud(userId, localSnapshot);
      return;
    }

    const remoteTime = new Date(remote.updatedAt).getTime();
    const localSyncTime =
      meta?.userId === userId ? new Date(meta.syncedAt).getTime() : 0;

    if (remoteTime > localSyncTime) {
      await applyRemoteSnapshot(remote.snapshot);
      await setSyncMeta(userId, remote.updatedAt);
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
