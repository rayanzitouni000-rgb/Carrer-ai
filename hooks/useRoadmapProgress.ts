import { useEffect, useMemo, useState } from 'react';

import { careerProfileStore } from '@/services/careerProfileStore';
import type { RoadmapStep } from '@/types';
import {
  calculateRoadmapSteps,
  getDashboardPreviewSteps,
} from '@/utils/roadmapProgressCalculator';
import { subscribeGamification } from '@/utils/gamificationSync';

import { useApplicationTracking } from './useApplicationTracking';
import { useCvActionsTracking } from './useCvActionsTracking';
import { useInterviewHistory } from './useInterviewHistory';

export interface UseRoadmapProgressReturn {
  steps: RoadmapStep[];
  previewSteps: RoadmapStep[];
  isReady: boolean;
}

export function useRoadmapProgress(): UseRoadmapProgressReturn {
  const cvActions = useCvActionsTracking();
  const { weekCount, isReady: applicationsReady } = useApplicationTracking();
  const { interviewSessionsCount, isReady: interviewsReady } = useInterviewHistory();
  const [skillsCount, setSkillsCount] = useState(() => careerProfileStore.get().skills.length);

  useEffect(() => {
    void careerProfileStore.hydrate().then((profile) => setSkillsCount(profile.skills.length));
    return subscribeGamification(() => {
      setSkillsCount(careerProfileStore.get().skills.length);
    });
  }, []);

  const steps = useMemo(
    () =>
      calculateRoadmapSteps({
        cvAnalyzedCount: cvActions.cvAnalyzedCount,
        cvGeneratedCount: cvActions.cvGeneratedCount,
        skillsCount,
        interviewSessionsCount,
        applicationsThisWeek: weekCount,
      }),
    [
      cvActions.cvAnalyzedCount,
      cvActions.cvGeneratedCount,
      skillsCount,
      interviewSessionsCount,
      weekCount,
    ]
  );

  const previewSteps = useMemo(() => getDashboardPreviewSteps(steps), [steps]);

  return {
    steps,
    previewSteps,
    isReady: cvActions.isReady && applicationsReady && interviewsReady,
  };
}
