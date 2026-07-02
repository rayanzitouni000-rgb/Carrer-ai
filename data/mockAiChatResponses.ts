import type { CareerProfile } from '@/features/career-onboarding/types';

export const SUGGESTED_PROMPTS: string[] = [
  'Comment améliorer mon CV ?',
  'Aide-moi à préparer mon prochain entretien',
  'Explique-moi mon Career Score',
  'Quelles compétences dois-je développer ?',
];

// TODO: remplacer entièrement cette fonction par un appel au backend
// (Claude API) une fois disponible — garder la même signature
// (userMessage, profile) => string/Promise<string> pour limiter le
// refactoring du hook useAiChat
export function getMockAiResponse(userMessage: string, profile: CareerProfile): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('cv')) {
    return "Je peux t'aider à améliorer ton CV ! Je te recommande de commencer par l'analyser dans CV Manager pour identifier tes points forts et axes d'amélioration.";
  }
  if (lower.includes('entretien')) {
    return `Pour te préparer, je te conseille de faire une simulation d'entretien ciblée sur le poste de ${profile.targetRoles[0] ?? 'ton choix'}. Tu peux la lancer directement depuis l'onglet Entretien.`;
  }
  if (lower.includes('score') || lower.includes('career score')) {
    return "Ton Career Score reflète ta progression sur plusieurs axes : profil complété, CV analysé/généré, compétences, candidatures, simulations d'entretien. Plus tu avances sur ces actions, plus il augmente !";
  }
  if (lower.includes('compétence') || lower.includes('competence')) {
    return "Regarde les offres qui t'intéressent dans Job Match : les compétences les plus demandées pour ton poste visé y apparaissent souvent. Tu peux ensuite les ajouter à ton profil.";
  }

  return "C'est une bonne question ! Pour l'instant je fonctionne avec des réponses limitées, mais bientôt je pourrai te répondre de façon beaucoup plus précise et personnalisée. 😊";
}
