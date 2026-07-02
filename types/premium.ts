export type PaywallTriggerContext =
  | 'cv_ai'
  | 'interview_limit'
  | 'chat_limit'
  | 'job_alerts'
  | 'generic';

export type PremiumProductId = 'premium_weekly' | 'premium_yearly';

export interface PremiumStatus {
  isPremium: boolean;
  activeProductId: PremiumProductId | null;
  expirationDate: string | null;
}

export interface UsageLimits {
  interviewSessionsThisMonth: number;
  chatMessagesToday: number;
  lastResetMonth: string;
  lastResetDay: string;
}

export const FREE_INTERVIEW_SESSIONS_PER_MONTH = 2;
export const FREE_CHAT_MESSAGES_PER_DAY = 5;

export const PAYWALL_CONTEXT_MESSAGES: Record<PaywallTriggerContext, string> = {
  cv_ai: 'Débloque la génération IA de CV',
  interview_limit: "Tu as atteint ta limite d'entretiens ce mois-ci",
  chat_limit: 'Continue de discuter avec ton coach IA',
  job_alerts: 'Reçois des alertes personnalisées',
  generic: 'Passe à Premium pour débloquer toutes les fonctionnalités',
};

export const PREMIUM_PRODUCTS: Record<
  PremiumProductId,
  { label: string; priceLabel: string; subtitle?: string; badge?: string; durationDays: number }
> = {
  premium_weekly: {
    label: 'Hebdomadaire',
    priceLabel: '9,99€ / semaine',
    durationDays: 7,
  },
  premium_yearly: {
    label: 'Annuel',
    priceLabel: '39,99€ / an',
    subtitle: 'soit 3,33€/mois',
    badge: 'Meilleure offre',
    durationDays: 365,
  },
};
