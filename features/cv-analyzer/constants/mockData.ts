export const CV_ANALYSIS = {
  careerScore: {
    current: 872,
    max: 1000,
    percentage: 87,
    rating: 'Excellent',
  },
  atsScore: {
    value: 94,
    description: 'Your CV is highly optimized for Applicant Tracking Systems.',
  },
  overallScore: {
    value: 9.2,
    max: 10,
    percentage: 92,
  },
  strengths: [
    'Strong experience',
    'Professional formatting',
    'Excellent technical skills',
    'Good readability',
  ],
  improvements: [
    'Add measurable achievements',
    'Improve summary section',
    'Include more industry keywords',
    'Optimize leadership experience',
  ],
  missingKeywords: [
    'React Native',
    'Leadership',
    'Scrum',
    'AWS',
    'Docker',
    'Firebase',
    'Communication',
  ],
  aiRecommendation:
    'Adding measurable business impact to your last two positions could significantly improve recruiter engagement.',
};

export const ANALYSIS_STEPS = [
  'Analyzing layout...',
  'Checking ATS compatibility...',
  'Detecting keywords...',
  'Evaluating experience...',
  'Calculating Career Score...',
  'Generating recommendations...',
] as const;

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  date: string;
  score: number;
  atsScore: number;
}

export const ANALYSIS_HISTORY: AnalysisHistoryItem[] = [
  { id: '1', fileName: 'Rayan_Zitouni_CV.pdf', date: 'Today, 10:30 AM', score: 872, atsScore: 94 },
  { id: '2', fileName: 'CV_v2_Updated.docx', date: 'Mar 12, 2026', score: 798, atsScore: 88 },
  { id: '3', fileName: 'Resume_English.pdf', date: 'Feb 28, 2026', score: 745, atsScore: 82 },
];

export const QUICK_ACTIONS = [
  { id: '1', label: 'Optimize CV', icon: 'sparkles-outline' as const, route: '/ai-chat' },
  { id: '2', label: 'New Resume', icon: 'document-text-outline' as const, route: '/ai-chat' },
  { id: '3', label: 'Cover Letter', icon: 'create-outline' as const, route: '/ai-chat' },
  { id: '4', label: 'Générer un CV', icon: 'document-text-outline' as const, route: '/cv-manager/generate' },
  { id: '5', label: 'Interview', icon: 'mic-outline' as const, route: '/(tabs)/interview-simulator' },
];

export const SUPPORTED_FORMATS = ['PDF', 'JPEG', 'PNG', 'WebP'] as const;
