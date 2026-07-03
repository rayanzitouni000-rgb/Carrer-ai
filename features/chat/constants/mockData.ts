import { IconName } from '@/design-system';

export const CHAT_USER = {
  name: 'Rayan',
};

export const AI_COACH = {
  name: 'CareerPilot AI',
  status: 'Online',
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const WELCOME_TOPICS = [
  'CV Improvement',
  'Interview Preparation',
  'Salary Negotiation',
  'Career Change',
  'LinkedIn Optimization',
  'Job Search',
] as const;

export interface SuggestedPrompt {
  id: string;
  label: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: '1', label: 'Improve my CV' },
  { id: '2', label: 'Prepare my interview' },
  { id: '3', label: 'Review this job offer' },
  { id: '4', label: 'Negotiate my salary' },
  { id: '5', label: 'Write a cover letter' },
  { id: '6', label: 'Find my strengths' },
  { id: '7', label: 'Career advice' },
  { id: '8', label: 'Switch career' },
];

export interface SmartAction {
  id: string;
  label: string;
  icon: IconName;
  route: string;
  gradient: readonly [string, string];
}

export const CHAT_SMART_ACTIONS: SmartAction[] = [
  { id: '1', label: 'Analyze CV', icon: 'document-text-outline', route: '/cv-analyzer', gradient: ['#1D4ED8', '#1D4ED8'] },
  { id: '2', label: 'Practice Interview', icon: 'mic-outline', route: '/(tabs)/interview-simulator', gradient: ['#06B6D4', '#2B6CFF'] },
  { id: '3', label: 'Cover Letter', icon: 'create-outline', route: '/ai-chat', gradient: ['#2B6CFF', '#EC4899'] },
  { id: '4', label: 'Job Match', icon: 'briefcase-outline', route: '/(tabs)/job-match', gradient: ['#2B6CFF', '#2B6CFF'] },
  { id: '5', label: 'Salary Analysis', icon: 'cash-outline', route: '/premium', gradient: ['#F59E0B', '#EF4444'] },
  { id: '6', label: 'LinkedIn Review', icon: 'logo-linkedin', route: '/(tabs)/profile', gradient: ['#0A66C2', '#2B6CFF'] },
];

export const MOCK_CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'How can I improve my CV?',
    timestamp: '10:24',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Your experience is solid. I recommend highlighting measurable achievements instead of listing only responsibilities. This usually increases recruiter engagement by 40%.',
    timestamp: '10:24',
  },
];

export const MOCK_AI_RESPONSES: Record<string, string> = {
  default:
    'Great question! Based on your profile, I suggest focusing on quantifiable results and tailoring your message to each role. Would you like me to dive deeper into a specific area?',
  'improve my cv':
    'Your experience is solid. I recommend highlighting measurable achievements instead of listing only responsibilities. This usually increases recruiter engagement significantly.',
  'prepare my interview':
    'Start with the STAR method for behavioral questions. Practice explaining your top 3 projects in under 2 minutes each. I can run a mock interview with you anytime.',
  'negotiate my salary':
    'Research market rates for your role and location first. Anchor the conversation on your value and achievements, not personal needs. I can help you prepare a negotiation script.',
  'write a cover letter':
    'Open with a compelling hook tied to the company mission. Connect 2-3 of your achievements directly to the job requirements. Keep it under 300 words.',
};

export function getMockAiResponse(userMessage: string): string {
  const key = userMessage.toLowerCase().trim();
  for (const [pattern, response] of Object.entries(MOCK_AI_RESPONSES)) {
    if (pattern !== 'default' && key.includes(pattern)) {
      return response;
    }
  }
  return MOCK_AI_RESPONSES.default;
}
