import type { CareerOnboardingStep } from '../types';

export const WELCOME_AI_MESSAGE =
  "Salut ! Je suis ton coach carrière IA. Je vais t'aider à trouver le job idéal.";

export const ONBOARDING_AI_MESSAGES: Partial<Record<CareerOnboardingStep, string>> = {
  personal: "Commençons par les bases — comment tu t'appelles ?",
  educationDetails: "Parle-moi de ta situation et de ton parcours scolaire.",
  experience: 'As-tu déjà une expérience professionnelle ?',
  goal: 'Quel est ton objectif principal ?',
  targetRole: 'Quel(s) poste(s) vises-tu ?',
  skills: 'Parle-moi de tes compétences.',
};
