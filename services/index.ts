export const navigationService = {
  routes: {
    splash: '/splash',
    onboarding: '/onboarding',
    careerOnboarding: '/career-onboarding',
    signup: '/signup',
    login: '/login',
    goalSelection: '/goal-selection',
    home: '/(tabs)',
    cvManager: '/(tabs)/cv-manager',
    aiChat: '/ai-chat',
    jobMatch: '/(tabs)/job-match',
    interview: '/(tabs)/interview-simulator',
    profile: '/(tabs)/profile',
    cvAnalyzer: '/cv-analyzer',
    premium: '/premium',
    settings: '/settings',
  },
};

export const mockAiService = {
  sendMessage: async (_message: string) => {
    return {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: 'Réponse mock du coach IA. L\'intégration AI sera ajoutée prochainement.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  },
};
