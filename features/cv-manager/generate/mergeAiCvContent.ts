import type { CareerProfile } from '@/features/career-onboarding/types';
import type { GeneratedCvData } from '@/types/cvGenerator';
import { buildCvDataFromProfile } from '@/features/cv-manager/generate/prefillCvData';

export interface AiGeneratedCvContent {
  headline?: string;
  summary?: string;
  experiences?: Array<{
    jobTitle: string;
    company: string;
    duration: string;
    description?: string;
  }>;
}

export function mergeAiCvIntoProfileData(
  profile: CareerProfile,
  cvContent: AiGeneratedCvContent
): GeneratedCvData {
  const base = buildCvDataFromProfile(profile);

  const experiences =
    cvContent.experiences?.map((exp, index) => ({
      id: `ai-exp-${index}-${Date.now()}`,
      jobTitle: exp.jobTitle ?? '',
      company: exp.company ?? '',
      duration: exp.duration ?? '',
      description: exp.description ?? '',
    })) ?? base.experiences;

  return {
    ...base,
    headline: cvContent.headline?.trim() || base.headline,
    summary: cvContent.summary?.trim() || base.summary,
    experiences,
  };
}
