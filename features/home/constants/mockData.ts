import { IconName } from '@/design-system';

export interface QuickAction {
  id: string;
  label: string;
  icon: IconName;
  route: string;
  gradient: readonly [string, string];
}

export const HOME_QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    label: 'Analyser mon CV',
    icon: 'document-text-outline',
    route: '/cv-analyzer',
    gradient: ['#1D4ED8', '#1D4ED8'],
  },
  {
    id: '2',
    label: "S'entraîner",
    icon: 'mic-outline',
    route: '/(tabs)/interview-simulator',
    gradient: ['#06B6D4', '#2B6CFF'],
  },
  {
    id: '3',
    label: 'Lettre de motivation',
    icon: 'create-outline',
    route: '/cover-letter',
    gradient: ['#2B6CFF', '#EC4899'],
  },
  {
    id: '4',
    label: 'Générer un CV',
    icon: 'document-text-outline',
    route: '/cv-manager/generate',
    gradient: ['#2B6CFF', '#06B6D4'],
  },
  {
    id: '5',
    label: 'Insights salaire',
    icon: 'cash-outline',
    route: '/premium',
    gradient: ['#F59E0B', '#EF4444'],
  },
];
