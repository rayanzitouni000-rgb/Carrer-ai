import type {
  ChatMessage,
  GoalOption,
  OnboardingSlide,
  UserProfile,
} from '@/types';

export const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Alex Martin',
  email: 'alex.martin@email.com',
  title: 'Développeur Full Stack Junior',
  goal: 'first-job',
  isPremium: false,
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Pilotez votre carrière',
    description:
      'CareerPilot AI vous accompagne à chaque étape de votre parcours professionnel avec des outils intelligents.',
    icon: 'rocket-outline',
  },
  {
    id: '2',
    title: 'Coach IA personnel',
    description:
      'Obtenez des conseils personnalisés, analysez votre CV et préparez vos entretiens avec notre assistant IA.',
    icon: 'chatbubbles-outline',
  },
  {
    id: '3',
    title: 'Atteignez vos objectifs',
    description:
      'Obtenez des conseils personnalisés, analysez votre CV et préparez vos entretiens avec notre assistant IA.',
    icon: 'trending-up-outline',
  },
];

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'first-job',
    title: 'Premier emploi',
    description: 'Trouver mon premier poste et lancer ma carrière',
    icon: 'school-outline',
  },
  {
    id: 'career-change',
    title: 'Reconversion',
    description: 'Changer de domaine et explorer de nouvelles voies',
    icon: 'swap-horizontal-outline',
  },
  {
    id: 'promotion',
    title: 'Évolution',
    description: 'Obtenir une promotion ou un poste senior',
    icon: 'arrow-up-outline',
  },
  {
    id: 'freelance',
    title: 'Freelance',
    description: 'Devenir indépendant et développer mon activité',
    icon: 'briefcase-outline',
  },
  {
    id: 'internship',
    title: 'Stage / Alternance',
    description: 'Trouver une opportunité pour acquérir de l\'expérience',
    icon: 'book-outline',
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Bonjour Alex ! Je suis votre coach carrière IA. Comment puis-je vous aider aujourd\'hui ?',
    timestamp: '10:00',
  },
  {
    id: '2',
    role: 'user',
    content: 'Comment puis-je améliorer mon CV pour un poste de développeur mobile ?',
    timestamp: '10:01',
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Excellente question ! Je vous recommande de mettre en avant vos projets React Native, d\'ajouter des métriques concrètes et de personnaliser votre CV pour chaque offre.',
    timestamp: '10:01',
  },
];

export const QUICK_ACTIONS = [
  { id: '1', label: 'Analyser CV', icon: 'document-text-outline', route: '/cv-analyzer' },
  { id: '2', label: 'Entretien', icon: 'mic-outline', route: '/(tabs)/interview-simulator' },
  { id: '3', label: 'Job Match', icon: 'briefcase-outline', route: '/(tabs)/job-match' },
  { id: '4', label: 'Premium', icon: 'diamond-outline', route: '/premium' },
];

export const PROFILE_MENU = [
  { id: '1', label: 'Paramètres', icon: 'settings-outline', route: '/settings' },
  { id: '2', label: 'Analyser mon CV', icon: 'document-text-outline', route: '/cv-analyzer' },
  { id: '3', label: 'Entretien', icon: 'mic-outline', route: '/(tabs)/interview-simulator' },
  { id: '4', label: 'Premium', icon: 'diamond-outline', route: '/premium' },
];
