export type SessionSource = 'free' | 'real_interview' | 'job_match' | 'assessment';

export type InterviewSessionType =
  | 'behavioral'
  | 'technical'
  | 'hr'
  | 'case_study'
  | 'leadership'
  | 'mixed';

export type InterviewDifficulty = 'easy' | 'medium' | 'hard';

export interface InterviewQuestion {
  id: string;
  text: string;
  tip?: string;
}

export interface InterviewAnswer {
  questionId: string;
  text: string;
}

export interface InterviewFeedback {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewSession {
  id: string;
  date: string;
  targetRole: string;
  type: InterviewSessionType;
  difficulty: InterviewDifficulty;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  feedback: InterviewFeedback | null;
  sessionSource: SessionSource;
  jobOfferId?: string;
  realInterviewId?: string;
}

export interface RealInterview {
  id: string;
  company: string;
  jobTitle: string;
  scheduledAt: string;
  status: 'upcoming' | 'past';
  linkedSessionId?: string;
}

export interface StartSessionParams {
  targetRole: string;
  type: InterviewSessionType;
  difficulty: InterviewDifficulty;
  sessionSource: SessionSource;
  jobOfferId?: string;
  realInterviewId?: string;
}

export const INTERVIEW_TYPE_OPTIONS: { id: InterviewSessionType; label: string }[] = [
  { id: 'behavioral', label: 'Comportemental' },
  { id: 'technical', label: 'Technique' },
  { id: 'hr', label: 'RH' },
  { id: 'case_study', label: 'Étude de cas' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'mixed', label: 'Mixte' },
];

export const INTERVIEW_DIFFICULTY_OPTIONS: { id: InterviewDifficulty; label: string }[] = [
  { id: 'easy', label: 'Facile' },
  { id: 'medium', label: 'Intermédiaire' },
  { id: 'hard', label: 'Difficile' },
];
