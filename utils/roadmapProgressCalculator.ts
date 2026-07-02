import { MIN_USER_SKILLS } from '@/features/career-onboarding/skills/types';
import type { RoadmapStep } from '@/types';

export interface RoadmapProgressInput {
  cvAnalyzedCount: number;
  cvGeneratedCount: number;
  skillsCount: number;
  interviewSessionsCount: number;
  applicationsThisWeek: number;
}

const STEP_DEFINITIONS = [
  {
    id: '1',
    title: 'Optimiser votre CV',
    description: 'Adapter votre CV aux offres ciblées',
    computeProgress: (input: RoadmapProgressInput) => {
      if (input.cvAnalyzedCount >= 1) return 100;
      if (input.cvGeneratedCount >= 1) return 50;
      return 0;
    },
  },
  {
    id: '2',
    title: 'Renforcer vos compétences',
    description: 'Compléter les formations recommandées',
    computeProgress: (input: RoadmapProgressInput) =>
      Math.min(100, Math.round((input.skillsCount / MIN_USER_SKILLS) * 100)),
  },
  {
    id: '3',
    title: 'Préparer les entretiens',
    description: "S'entraîner avec le simulateur IA",
    computeProgress: (input: RoadmapProgressInput) =>
      Math.min(100, input.interviewSessionsCount * 25),
  },
  {
    id: '4',
    title: 'Postuler activement',
    description: 'Envoyer 5 candidatures par semaine',
    computeProgress: (input: RoadmapProgressInput) =>
      Math.min(100, Math.round((input.applicationsThisWeek / 5) * 100)),
  },
] as const;

function deriveStatus(
  progress: number,
  index: number,
  previousSteps: RoadmapStep[]
): RoadmapStep['status'] {
  if (progress >= 100) return 'completed';
  const previousComplete = index === 0 || previousSteps[index - 1]?.status === 'completed';
  if (!previousComplete) return 'locked';
  const hasInProgressBefore = previousSteps.some((step) => step.status === 'in-progress');
  if (hasInProgressBefore) return 'locked';
  return 'in-progress';
}

export function calculateRoadmapSteps(input: RoadmapProgressInput): RoadmapStep[] {
  const steps: RoadmapStep[] = [];

  for (let index = 0; index < STEP_DEFINITIONS.length; index += 1) {
    const definition = STEP_DEFINITIONS[index];
    const progress = definition.computeProgress(input);
    const status = deriveStatus(progress, index, steps);
    steps.push({
      id: definition.id,
      title: definition.title,
      description: definition.description,
      progress,
      status,
    });
  }

  return steps;
}

/** Deux étapes à mettre en avant sur le Dashboard : en cours + suivante verrouillée. */
export function getDashboardPreviewSteps(steps: RoadmapStep[]): RoadmapStep[] {
  const inProgressIndex = steps.findIndex((step) => step.status === 'in-progress');
  if (inProgressIndex >= 0) {
    const current = steps[inProgressIndex];
    const next = steps[inProgressIndex + 1];
    return next ? [current, next] : [current];
  }

  const firstIncomplete = steps.find((step) => step.status !== 'completed');
  if (firstIncomplete) {
    const index = steps.indexOf(firstIncomplete);
    return steps.slice(index, index + 2);
  }

  return steps.slice(-2);
}
