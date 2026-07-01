import { IconName } from '@/design-system';

export const NEXT_INTERVIEW = {
  role: 'Senior Product Designer',
  company: 'Google',
  difficulty: 'Intermediate',
  duration: '20 min',
};

export interface InterviewType {
  id: string;
  label: string;
  icon: IconName;
  gradient: readonly [string, string];
}

export const INTERVIEW_TYPES: InterviewType[] = [
  { id: '1', label: 'Behavioral', icon: 'people-outline', gradient: ['#2563EB', '#6366F1'] },
  { id: '2', label: 'Technical', icon: 'code-slash-outline', gradient: ['#06B6D4', '#3B82F6'] },
  { id: '3', label: 'HR', icon: 'briefcase-outline', gradient: ['#8B5CF6', '#EC4899'] },
  { id: '4', label: 'Case Study', icon: 'analytics-outline', gradient: ['#F59E0B', '#EF4444'] },
  { id: '5', label: 'Leadership', icon: 'ribbon-outline', gradient: ['#10B981', '#06B6D4'] },
  { id: '6', label: 'System Design', icon: 'git-network-outline', gradient: ['#6366F1', '#8B5CF6'] },
];

export const QUESTION_PREVIEW = {
  question: 'Tell me about yourself.',
  tip: 'Focus on measurable achievements rather than responsibilities.',
};

export interface LiveMessage {
  id: string;
  role: 'recruiter' | 'candidate';
  content: string;
}

export const LIVE_DIALOGUE: LiveMessage[] = [
  {
    id: '1',
    role: 'recruiter',
    content: 'Good morning! Thank you for joining us today. Tell me about yourself.',
  },
  {
    id: '2',
    role: 'candidate',
    content:
      "I'm a product designer with 5 years of experience building user-centered digital products. At my current role, I led a redesign that increased user engagement by 34%.",
  },
  {
    id: '3',
    role: 'recruiter',
    content: "That's impressive. Can you walk me through a challenging project you handled recently?",
  },
];

export interface VoiceMetric {
  id: string;
  label: string;
  value: number;
}

export const VOICE_METRICS: VoiceMetric[] = [
  { id: '1', label: 'Confidence', value: 92 },
  { id: '2', label: 'Clarity', value: 88 },
  { id: '3', label: 'Communication', value: 90 },
  { id: '4', label: 'Structure', value: 84 },
  { id: '5', label: 'Eye Contact', value: 91 },
  { id: '6', label: 'Speaking Pace', value: 87 },
];

export const INTERVIEW_SCORE = {
  overall: 89,
  max: 100,
  rating: 'Excellent performance.',
};

export const AI_FEEDBACK =
  'You answered confidently and structured your ideas well. Try adding more measurable achievements and concise examples.';

export const IMPROVEMENT_AREAS = [
  'Reduce filler words',
  'Use STAR method',
  'Improve confidence',
  'Shorten answers',
  'Maintain eye contact',
];

export interface CommonQuestion {
  id: string;
  question: string;
  tip: string;
}

export const COMMON_QUESTIONS: CommonQuestion[] = [
  {
    id: '1',
    question: 'Why should we hire you?',
    tip: 'Highlight unique value and align with the role requirements.',
  },
  {
    id: '2',
    question: 'Tell me about yourself.',
    tip: 'Keep it under 2 minutes. Focus on relevant experience.',
  },
  {
    id: '3',
    question: 'Describe a challenge.',
    tip: 'Use the STAR method: Situation, Task, Action, Result.',
  },
  {
    id: '4',
    question: 'Greatest weakness.',
    tip: 'Be honest but show self-awareness and improvement steps.',
  },
  {
    id: '5',
    question: 'Salary expectations.',
    tip: 'Research market rates and provide a reasonable range.',
  },
];

export interface InterviewSession {
  id: string;
  company: string;
  role: string;
  score: number;
  date: string;
}

export const INTERVIEW_HISTORY: InterviewSession[] = [
  { id: '1', company: 'Google', role: 'Product Designer', score: 89, date: 'Today' },
  { id: '2', company: 'Amazon', role: 'UX Designer', score: 82, date: 'Mar 10, 2026' },
  { id: '3', company: 'Microsoft', role: 'Senior Designer', score: 85, date: 'Mar 3, 2026' },
  { id: '4', company: 'Spotify', role: 'Product Designer', score: 78, date: 'Feb 22, 2026' },
];

export const QUICK_ACTIONS = [
  { id: '1', label: 'Start Practice', icon: 'play-outline' as const },
  { id: '2', label: 'Generate Questions', icon: 'sparkles-outline' as const },
  { id: '3', label: 'Interview History', icon: 'time-outline' as const },
  { id: '4', label: 'Analyze Answers', icon: 'analytics-outline' as const },
];

export const RECRUITER = {
  name: 'Sarah Chen',
  title: 'AI Recruiter',
};
