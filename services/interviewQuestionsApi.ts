import { getApiBaseUrl, isAiApiConfigured, QUOTA_EXCEEDED_MESSAGE } from '@/constants/apiConfig';
import type { CareerProfile } from '@/features/career-onboarding/types';
import type { InterviewDifficulty, InterviewQuestion } from '@/types/interviewSimulator';
import type { JobOffer } from '@/types/jobMatch';
import { fetchJobOfferById } from '@/services/jobSearchApi';
import { jobOfferStore } from '@/services/jobOfferStore';
import { getJobOfferById } from '@/utils/jobOfferResolver';
import { getQuestionsForSession } from '@/utils/interviewSimulatorUtils';

function mapDifficultyToApi(difficulty: InterviewDifficulty): string {
  if (difficulty === 'easy') return 'beginner';
  if (difficulty === 'hard') return 'expert';
  return 'intermediate';
}

interface ApiInterviewQuestion {
  text: string;
  type: 'rh' | 'technical';
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

export async function resolveJobOfferForInterview(jobOfferId?: string): Promise<JobOffer | null> {
  if (!jobOfferId) return null;
  const cached = getJobOfferById(jobOfferId);
  if (cached) return cached;
  const fetched = await fetchJobOfferById(jobOfferId);
  if (fetched) {
    jobOfferStore.set(fetched);
    return fetched;
  }
  return null;
}

export async function fetchInterviewQuestionsFromApi(params: {
  profile: CareerProfile;
  jobOffer: JobOffer | null;
  difficulty: InterviewDifficulty;
  sessionType: string;
}): Promise<InterviewQuestion[]> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl || !isAiApiConfigured()) {
    throw new Error('API non configurée');
  }

  const response = await fetch(`${baseUrl}/api/generate-interview-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: params.profile,
      jobOffer: params.jobOffer,
      difficulty: mapDifficultyToApi(params.difficulty),
    }),
  });

  const data = (await response.json()) as {
    questions?: ApiInterviewQuestion[];
    error?: string;
  };

  if (response.status === 429 && data.error === 'QUOTA_EXCEEDED') {
    throw new Error('QUOTA_EXCEEDED');
  }

  if (!response.ok || !data.questions?.length) {
    throw new Error(data.error ?? 'Erreur génération questions');
  }

  return data.questions.map((question, index) => ({
    id: `ai-q-${index}-${Date.now()}`,
    text: question.text,
    tip:
      question.type === 'technical'
        ? 'Réponse technique attendue — structure ta réponse avec un exemple concret.'
        : 'Réponse comportementale — utilise la méthode STAR si possible.',
  }));
}

export function getFallbackInterviewQuestions(
  sessionType: Parameters<typeof getQuestionsForSession>[0],
  difficulty: InterviewDifficulty
): InterviewQuestion[] {
  return getQuestionsForSession(sessionType, difficulty);
}

export { QUOTA_EXCEEDED_MESSAGE };
