import { IconName } from '@/design-system';

export interface HomeTask {
  id: string;
  label: string;
  icon: IconName;
  completed: boolean;
}

export const TODAYS_TASKS: HomeTask[] = [
  { id: '1', label: 'Améliorer mon CV', icon: 'document-text-outline', completed: true },
  { id: '2', label: 'Postuler à 5 offres', icon: 'briefcase-outline', completed: true },
  { id: '3', label: "S'entraîner à l'entretien", icon: 'mic-outline', completed: false },
];

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
    gradient: ['#2563EB', '#6366F1'],
  },
  {
    id: '2',
    label: "S'entraîner",
    icon: 'mic-outline',
    route: '/(tabs)/interview-simulator',
    gradient: ['#06B6D4', '#3B82F6'],
  },
  {
    id: '3',
    label: 'Lettre de motivation',
    icon: 'create-outline',
    route: '/cover-letter',
    gradient: ['#8B5CF6', '#EC4899'],
  },
  {
    id: '4',
    label: 'Générer un CV',
    icon: 'document-text-outline',
    route: '/cv-manager/generate',
    gradient: ['#3B82F6', '#06B6D4'],
  },
  {
    id: '5',
    label: 'Insights salaire',
    icon: 'cash-outline',
    route: '/premium',
    gradient: ['#F59E0B', '#EF4444'],
  },
];
