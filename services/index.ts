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
    aiChat: '/(tabs)/ai-chat',
    jobMatch: '/(tabs)/job-match',
    profile: '/(tabs)/profile',
    cvAnalyzer: '/cv-analyzer',
    interview: '/interview',
    roadmap: '/roadmap',
    premium: '/premium',
    settings: '/settings',
  },
};

export const mockAuthService = {
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    const { authService } = await import('./authService');
    return authService.login({ email, password });
  },
  register: async (email: string, password: string, firstName: string) => {
    const { authService } = await import('./authService');
    return authService.register({ email, password, firstName });
  },
  logout: async () => {
    const { authService } = await import('./authService');
    await authService.logout();
    return { success: true };
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
