import { IconName } from '@/design-system';

export const HOME_USER = {
  name: 'Rayan',
  fullName: 'Rayan Zitouni',
  title: 'Full Stack Developer',
  avatarUrl: undefined as string | undefined,
};

export const CAREER_SCORE = {
  current: 842,
  max: 1000,
  percentage: 84,
  status: 'Excellent Progress 🚀',
  description: 'Your profile is in the top 12% of candidates in your field.',
};

export interface HomeTask {
  id: string;
  label: string;
  icon: IconName;
  completed: boolean;
}

export const TODAYS_TASKS: HomeTask[] = [
  { id: '1', label: 'Improve CV', icon: 'document-text-outline', completed: true },
  { id: '2', label: 'Apply to 5 jobs', icon: 'briefcase-outline', completed: true },
  { id: '3', label: 'Practice Interview', icon: 'mic-outline', completed: false },
];

export const AI_COACH_RECOMMENDATION = {
  title: 'AI Career Coach',
  subtitle: 'Your next recommendation',
  message:
    'Your CV is already strong. Improving your LinkedIn profile could increase your interview rate by 34%.',
};

export interface QuickAction {
  id: string;
  label: string;
  icon: IconName;
  route: string;
  gradient: readonly [string, string];
}

export const HOME_QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'Analyze CV', icon: 'document-text-outline', route: '/cv-analyzer', gradient: ['#2563EB', '#6366F1'] },
  { id: '2', label: 'Interview Practice', icon: 'mic-outline', route: '/interview', gradient: ['#06B6D4', '#3B82F6'] },
  { id: '3', label: 'Cover Letter', icon: 'create-outline' as const, route: '/ai-chat', gradient: ['#8B5CF6', '#EC4899'] },
  { id: '4', label: 'Générer un CV', icon: 'document-text-outline', route: '/cv-manager/generate', gradient: ['#3B82F6', '#06B6D4'] },
  { id: '5', label: 'Salary Insights', icon: 'cash-outline', route: '/premium', gradient: ['#F59E0B', '#EF4444'] },
];

export interface ApplicationStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: IconName;
}

export const APPLICATION_STATS: ApplicationStat[] = [
  { id: '1', label: 'Applications Sent', value: 24, icon: 'paper-plane-outline' },
  { id: '2', label: 'Interviews', value: 6, icon: 'calendar-outline' },
  { id: '3', label: 'Response Rate', value: 38, suffix: '%', icon: 'trending-up-outline' },
  { id: '4', label: 'Offers', value: 2, icon: 'trophy-outline' },
];

export interface RoadmapPosition {
  id: string;
  label: string;
  role: string;
  status: 'current' | 'next' | 'dream';
}

export const ROADMAP_PREVIEW: RoadmapPosition[] = [
  { id: '1', label: 'Current', role: 'Junior Developer', status: 'current' },
  { id: '2', label: 'Next', role: 'Mid-Level Engineer', status: 'next' },
  { id: '3', label: 'Dream', role: 'Tech Lead', status: 'dream' },
];

export const UPCOMING_INTERVIEW = {
  company: 'TechFlow',
  role: 'React Native Dev',
  date: 'Tomorrow, 2:00 PM',
};
