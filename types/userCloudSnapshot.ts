import type { CareerOnboardingStep, CareerProfile } from '@/features/career-onboarding/types';

export const USER_CLOUD_SNAPSHOT_VERSION = 1 as const;

/** Snapshot complet des données utilisateur stocké dans career_profiles.profile_data */
export interface UserCloudSnapshot {
  version: typeof USER_CLOUD_SNAPSHOT_VERSION;
  careerProfile: CareerProfile | null;
  onboardingStep: CareerOnboardingStep | null;
  savedJobs: unknown;
  jobMatchApplications: number;
  applicationEntries: unknown;
  cvActionsTracking: unknown;
  interviewSessions: unknown;
  realInterviews: unknown;
  jobSearchPreferences: unknown;
  onboardingAssessment: unknown;
  usageLimits: unknown;
  aiChatHistory: unknown;
  appStreak: unknown;
  premiumStatus: unknown;
}

export function createEmptyCloudSnapshot(): UserCloudSnapshot {
  return {
    version: USER_CLOUD_SNAPSHOT_VERSION,
    careerProfile: null,
    onboardingStep: null,
    savedJobs: [],
    jobMatchApplications: 0,
    applicationEntries: [],
    cvActionsTracking: { cvAnalyzedCount: 0, cvGeneratedCount: 0 },
    interviewSessions: { sessions: [], count: 0 },
    realInterviews: { count: 0, interviews: [] },
    jobSearchPreferences: null,
    onboardingAssessment: {
      hasCompletedAssessment: false,
      hasSkippedAssessment: false,
      lastAssessmentScore: null,
    },
    usageLimits: null,
    aiChatHistory: null,
    appStreak: { currentStreakDays: 0, lastOpenDate: null },
    premiumStatus: null,
  };
}
