import type {
  ChatMessage,
  GoalOption,
  JobListing,
  OnboardingSlide,
  RoadmapStep,
  SkillProgress,
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
      'Suivez votre progression, découvrez des offres adaptées et construisez votre roadmap de carrière.',
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

export const MOCK_JOBS: JobListing[] = [
  {
    id: '1',
    title: 'Développeur React Native',
    company: 'TechFlow',
    location: 'Paris, France',
    salary: '45 000 - 55 000 €',
    type: 'full-time',
    matchScore: 92,
    postedAt: 'Il y a 2 jours',
    tags: ['React Native', 'TypeScript', 'Expo'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'StartupLab',
    location: 'Remote',
    salary: '40 000 - 50 000 €',
    type: 'remote',
    matchScore: 87,
    postedAt: 'Il y a 3 jours',
    tags: ['React', 'JavaScript', 'CSS'],
  },
  {
    id: '3',
    title: 'Mobile Developer Junior',
    company: 'AppCraft',
    location: 'Lyon, France',
    salary: '38 000 - 45 000 €',
    type: 'full-time',
    matchScore: 78,
    postedAt: 'Il y a 5 jours',
    tags: ['Mobile', 'iOS', 'Android'],
  },
  {
    id: '4',
    title: 'Développeur Full Stack',
    company: 'DigitalWave',
    location: 'Bordeaux, France',
    salary: '42 000 - 52 000 €',
    type: 'full-time',
    matchScore: 85,
    postedAt: 'Il y a 1 semaine',
    tags: ['Node.js', 'React', 'MongoDB'],
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

export const MOCK_ROADMAP: RoadmapStep[] = [
  {
    id: '1',
    title: 'Optimiser votre CV',
    description: 'Adapter votre CV aux offres ciblées',
    status: 'completed',
    progress: 100,
  },
  {
    id: '2',
    title: 'Renforcer vos compétences',
    description: 'Compléter les formations recommandées',
    status: 'in-progress',
    progress: 65,
  },
  {
    id: '3',
    title: 'Préparer les entretiens',
    description: 'S\'entraîner avec le simulateur IA',
    status: 'locked',
    progress: 0,
  },
  {
    id: '4',
    title: 'Postuler activement',
    description: 'Envoyer 5 candidatures par semaine',
    status: 'locked',
    progress: 0,
  },
];

export const MOCK_SKILLS: SkillProgress[] = [
  { id: '1', name: 'React Native', progress: 75, category: 'Technique' },
  { id: '2', name: 'TypeScript', progress: 68, category: 'Technique' },
  { id: '3', name: 'Communication', progress: 82, category: 'Soft Skills' },
  { id: '4', name: 'Entretien', progress: 45, category: 'Carrière' },
  { id: '5', name: 'Réseau professionnel', progress: 30, category: 'Carrière' },
];

export const QUICK_ACTIONS = [
  { id: '1', label: 'Analyser CV', icon: 'document-text-outline', route: '/cv-analyzer' },
  { id: '2', label: 'Entretien', icon: 'mic-outline', route: '/interview' },
  { id: '3', label: 'Roadmap', icon: 'map-outline', route: '/roadmap' },
  { id: '4', label: 'Premium', icon: 'diamond-outline', route: '/premium' },
];

export const PROFILE_MENU = [
  { id: '1', label: 'Paramètres', icon: 'settings-outline', route: '/settings' },
  { id: '2', label: 'Roadmap', icon: 'map-outline', route: '/roadmap' },
  { id: '3', label: 'CV Analyzer', icon: 'document-text-outline', route: '/cv-analyzer' },
  { id: '4', label: 'Entretien', icon: 'mic-outline', route: '/interview' },
  { id: '5', label: 'Premium', icon: 'diamond-outline', route: '/premium' },
];
