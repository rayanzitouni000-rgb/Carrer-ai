import { useMemo, useState, useEffect, useCallback } from 'react';

import type { CareerProfile } from '@/features/career-onboarding/types';
import { useSavedJobs } from '@/features/jobs/hooks/useSavedJobs';
import { careerProfileStore } from '@/services/careerProfileStore';
import type { RankInfo } from '@/types/rank';
import { calculateCareerScore, type ScoreBreakdown } from '@/utils/careerScoreCalculator';
import { calculateRank } from '@/utils/rankCalculator';
import { notifyGamification, subscribeGamification } from '@/utils/gamificationSync';

import { useAppStreak } from './useAppStreak';
import { useCvActionsTracking } from './useCvActionsTracking';
import { useCvTracking } from './useCvTracking';
import { useInterviewHistory } from './useInterviewHistory';
import { useRealInterviews } from './useRealInterviews';

export interface UseCareerScoreReturn {
  score: number;
  breakdown: ScoreBreakdown;
  rank: RankInfo;
  streakDays: number;
  isReady: boolean;
}

export function useCareerScore(): UseCareerScoreReturn {
  const [profile, setProfile] = useState<CareerProfile>(careerProfileStore.get());
  const cvActions = useCvActionsTracking();
  const cvTracking = useCvTracking();
  const interviewHistory = useInterviewHistory();
  const realInterviews = useRealInterviews();
  const savedJobs = useSavedJobs();
  const { currentStreakDays } = useAppStreak();

  const refreshProfile = useCallback(() => {
    setProfile(careerProfileStore.get());
  }, []);

  useEffect(() => {
    void careerProfileStore.hydrate().then(setProfile);
    const unsubscribe = subscribeGamification(refreshProfile);
    return unsubscribe;
  }, [refreshProfile]);

  const breakdown = useMemo(
    () =>
      calculateCareerScore({
        profile,
        cvAnalyzedCount: cvActions.cvAnalyzedCount,
        cvGeneratedCount: cvActions.cvGeneratedCount,
        applicationsSentCount: cvTracking.entries.length,
        interviewSessionsCount: interviewHistory.interviewSessionsCount,
        realInterviewsCount: realInterviews.realInterviewsCount,
        savedJobsCount: savedJobs.savedJobsCount,
        jobApplicationsFromMatchCount: savedJobs.jobApplicationsFromMatchCount,
      }),
    [
      profile,
      cvActions.cvAnalyzedCount,
      cvActions.cvGeneratedCount,
      cvTracking.entries.length,
      interviewHistory.interviewSessionsCount,
      realInterviews.realInterviewsCount,
      savedJobs.savedJobsCount,
      savedJobs.jobApplicationsFromMatchCount,
    ]
  );

  const rank = useMemo(() => calculateRank(breakdown.total), [breakdown.total]);

  const isReady =
    cvActions.isReady &&
    cvTracking.isReady &&
    interviewHistory.isReady &&
    realInterviews.isReady &&
    savedJobs.isReady;

  return {
    score: breakdown.total,
    breakdown,
    rank,
    streakDays: currentStreakDays,
    isReady,
  };
}

export { notifyGamification };
