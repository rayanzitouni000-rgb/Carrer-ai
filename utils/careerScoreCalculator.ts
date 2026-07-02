import { requiresPastEducationInput } from '@/features/career-onboarding/utils/educationSituationUtils';
import { isSituationDetailsComplete } from '@/features/career-onboarding/utils/situationDetailsValidation';
import type { CareerProfile } from '@/features/career-onboarding/types';
import { MIN_USER_SKILLS } from '@/features/career-onboarding/skills/types';

export interface ScoreBreakdown {
  profileCompletion: number;
  cvAnalyzed: number;
  cvGenerated: number;
  skillsScore: number;
  applicationsScore: number;
  interviewSimScore: number;
  realInterviewsScore: number;
  jobMatchScore: number;
  total: number;
}

export interface CareerScoreInput {
  profile: CareerProfile;
  cvAnalyzedCount: number;
  cvGeneratedCount: number;
  applicationsSentCount: number;
  interviewSessionsCount: number;
  realInterviewsCount: number;
  savedJobsCount: number;
  jobApplicationsFromMatchCount: number;
}

function calculateProfileCompletionScore(profile: CareerProfile): number {
  let points = 0;

  if (profile.firstName.trim().length > 0) points += 15;
  if (profile.ageRange) points += 15;

  if (profile.currentSituation) points += 15;
  if (
    profile.currentSituation &&
    isSituationDetailsComplete(profile.currentSituation, profile.situationDetails)
  ) {
    points += 35;
  }

  if (
    profile.currentSituation &&
    (!requiresPastEducationInput(profile.currentSituation) || profile.educationLevel !== null)
  ) {
    points += 10;
  }

  if (
    profile.hasNoExperience ||
    profile.experiences.some((exp) => exp.jobTitle.trim().length > 0)
  ) {
    points += 20;
  }

  if (profile.careerGoal) points += 15;
  if (profile.targetRoles.length >= 1) points += 20;
  if (profile.skills.length >= MIN_USER_SKILLS) points += 15;

  return Math.min(150, points);
}

export function calculateCareerScore(input: CareerScoreInput): ScoreBreakdown {
  const profileCompletion = calculateProfileCompletionScore(input.profile);
  const cvAnalyzed = input.cvAnalyzedCount >= 1 ? 100 : 0;
  const cvGenerated = input.cvGeneratedCount >= 1 ? 100 : 0;
  const skillsScore = Math.min(100, Math.floor(input.profile.skills.length / 3) * 20);
  const applicationsScore = Math.min(150, input.applicationsSentCount * 10);
  const interviewSimScore = Math.min(200, input.interviewSessionsCount * 40);
  const realInterviewsScore = Math.min(100, input.realInterviewsCount * 50);
  const jobMatchScore = Math.min(
    100,
    input.savedJobsCount * 10 + input.jobApplicationsFromMatchCount * 15
  );

  const total = Math.min(
    1000,
    profileCompletion +
      cvAnalyzed +
      cvGenerated +
      skillsScore +
      applicationsScore +
      interviewSimScore +
      realInterviewsScore +
      jobMatchScore
  );

  return {
    profileCompletion,
    cvAnalyzed,
    cvGenerated,
    skillsScore,
    applicationsScore,
    interviewSimScore,
    realInterviewsScore,
    jobMatchScore,
    total,
  };
}
