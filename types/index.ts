export type CareerGoal =
  | 'first-job'
  | 'career-change'
  | 'promotion'
  | 'freelance'
  | 'internship';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  goal: CareerGoal;
  title: string;
  isPremium: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GoalOption {
  id: CareerGoal;
  title: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}
