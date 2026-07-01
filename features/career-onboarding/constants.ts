import type {
  AgeRange,
  CareerGoalId,
  CurrentSituation,
  EducationLevel,
  FieldOfStudy,
} from './types';

export interface SelectOption<T extends string = string> {
  id: T;
  label: string;
  description?: string;
  emoji?: string;
}

export const AGE_OPTIONS: SelectOption<AgeRange>[] = [
  { id: '15-17', label: '15-17' },
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55+', label: '55+' },
];

export const EDUCATION_LEVEL_OPTIONS: SelectOption<EducationLevel>[] = [
  { id: 'college', label: 'Collège' },
  { id: 'cap-bep', label: 'CAP / BEP' },
  { id: 'bac-general', label: 'Bac (Général)' },
  { id: 'bac-techno', label: 'Bac (Techno)' },
  { id: 'bac-pro', label: 'Bac (Pro)' },
  { id: 'bac-2', label: 'Bac+2 (BTS/DUT/BUT)' },
  { id: 'bac-3', label: 'Bac+3 (Licence)' },
  { id: 'bac-5-master', label: 'Bac+5 (Master)' },
  { id: 'ingenieur', label: "Diplôme d'ingénieur" },
  { id: 'commerce-ecole', label: 'Diplôme de commerce (école)' },
  { id: 'doctorat', label: 'Doctorat' },
  { id: 'autodidacte', label: 'Autodidacte / Formation en ligne' },
  { id: 'autre', label: 'Autre' },
];

/** Options fusionnées situation + niveau d'études (quand le niveau est connu). */
export interface CurrentProfileOption {
  id: string;
  label: string;
  emoji?: string;
  currentSituation: CurrentSituation;
  educationLevel?: EducationLevel;
}

export const CURRENT_PROFILE_OPTIONS: CurrentProfileOption[] = [
  { id: 'lyceen', label: 'Lycéen(ne)', emoji: '🎒', currentSituation: 'lyceen', educationLevel: 'bac-general' },
  { id: 'etudiant-bac2', label: 'Étudiant(e) · Bac+2', emoji: '📚', currentSituation: 'etudiant', educationLevel: 'bac-2' },
  { id: 'etudiant-bac3', label: 'Étudiant(e) · Bac+3', emoji: '📚', currentSituation: 'etudiant', educationLevel: 'bac-3' },
  { id: 'etudiant-bac5', label: 'Étudiant(e) · Bac+5', emoji: '🎓', currentSituation: 'etudiant', educationLevel: 'bac-5-master' },
  {
    id: 'etudiant-grande-ecole',
    label: 'Étudiant(e) · Grande école',
    emoji: '🏫',
    currentSituation: 'etudiant',
    educationLevel: 'ingenieur',
  },
  { id: 'alternant', label: 'Alternant(e)', emoji: '🤝', currentSituation: 'alternant', educationLevel: 'bac-2' },
  { id: 'jeune-diplome', label: 'Jeune diplômé(e)', emoji: '🎉', currentSituation: 'jeune-diplome' },
  { id: 'recherche-emploi', label: "En recherche d'emploi", emoji: '🔍', currentSituation: 'recherche-emploi' },
  { id: 'en-poste', label: 'En poste', emoji: '💼', currentSituation: 'en-poste' },
  { id: 'freelance', label: 'Freelance / Indépendant(e)', emoji: '🧑‍💻', currentSituation: 'freelance' },
  { id: 'entrepreneur', label: 'Entrepreneur(e)', emoji: '🚀', currentSituation: 'entrepreneur' },
  { id: 'reconversion', label: 'En reconversion', emoji: '🔄', currentSituation: 'reconversion' },
  { id: 'pause-carriere', label: 'En pause de carrière', emoji: '⏸️', currentSituation: 'pause-carriere' },
  { id: 'retraite-actif', label: 'Retraité(e) actif(ve)', emoji: '⏳', currentSituation: 'retraite-actif' },
];

export const SITUATION_OPTIONS: SelectOption<CurrentSituation>[] = [
  { id: 'lyceen', label: 'Lycéen(ne)' },
  { id: 'etudiant', label: 'Étudiant(e)' },
  { id: 'alternant', label: 'Alternant(e)' },
  { id: 'jeune-diplome', label: 'Jeune diplômé(e)' },
  { id: 'recherche-emploi', label: "En recherche d'emploi" },
  { id: 'en-poste', label: 'En poste' },
  { id: 'freelance', label: 'Freelance / Indépendant(e)' },
  { id: 'entrepreneur', label: 'Entrepreneur(e)' },
  { id: 'reconversion', label: 'En reconversion' },
  { id: 'pause-carriere', label: 'En pause de carrière' },
  { id: 'retraite-actif', label: 'Retraité(e) actif(ve)' },
];

export function getCurrentProfileOptionId(profile: {
  currentSituation: CurrentSituation | null;
  educationLevel: EducationLevel | null;
}): string | null {
  if (!profile.currentSituation) return null;

  const match = CURRENT_PROFILE_OPTIONS.find(
    (option) =>
      option.currentSituation === profile.currentSituation &&
      (option.educationLevel === profile.educationLevel ||
        (option.educationLevel === undefined && profile.educationLevel === null))
  );

  return match?.id ?? null;
}

export function getCurrentProfileLabel(profile: {
  currentSituation: CurrentSituation | null;
  educationLevel: EducationLevel | null;
}): string {
  const optionId = getCurrentProfileOptionId(profile);
  if (optionId) {
    return CURRENT_PROFILE_OPTIONS.find((option) => option.id === optionId)?.label ?? '—';
  }
  if (profile.currentSituation) {
    return getOptionLabel(SITUATION_OPTIONS, profile.currentSituation);
  }
  return '—';
}

export const FIELD_OPTIONS: SelectOption<FieldOfStudy>[] = [
  { id: 'informatique', label: 'Informatique / Tech' },
  { id: 'commerce-gestion', label: 'Commerce / Gestion' },
  { id: 'ingenierie', label: 'Ingénierie' },
  { id: 'marketing-communication', label: 'Marketing / Communication' },
  { id: 'finance-comptabilite', label: 'Finance / Comptabilité' },
  { id: 'design-arts', label: 'Design / Arts' },
  { id: 'sante-social', label: 'Santé / Social' },
  { id: 'droit', label: 'Droit' },
  { id: 'sciences', label: 'Sciences' },
  { id: 'education', label: 'Éducation' },
  { id: 'artisanat', label: 'Artisanat / Métiers manuels' },
  { id: 'autre', label: 'Autre' },
];

export const PRIMARY_CAREER_GOAL_IDS = [
  'premier-emploi',
  'alternance',
  'reconversion',
  'meilleur-emploi',
  'stage',
  'evoluer-poste',
] as const;

export const CAREER_GOAL_OPTIONS: SelectOption<CareerGoalId>[] = [
  { id: 'premier-emploi', label: 'Décrocher mon premier emploi', emoji: '🚀' },
  { id: 'reconversion', label: 'Me reconvertir', emoji: '🔄' },
  { id: 'evoluer-poste', label: 'Évoluer dans mon poste actuel', emoji: '📈' },
  { id: 'meilleur-emploi', label: 'Trouver un meilleur emploi', emoji: '💼' },
  { id: 'augmenter-salaire', label: 'Augmenter mon salaire', emoji: '💰' },
  { id: 'opportunites-etranger', label: "Trouver des opportunités à l'étranger", emoji: '🌍' },
  {
    id: 'reussite-etudes',
    label: "Réussir mes études / préparer ma sortie d'école",
    emoji: '🎓',
  },
  { id: 'freelance', label: 'Me lancer en freelance', emoji: '🧑‍💻' },
  { id: 'creer-entreprise', label: 'Créer mon entreprise', emoji: '🏢' },
  { id: 'alternance', label: 'Trouver une alternance', emoji: '🤝' },
  { id: 'retour-apres-pause', label: 'Retrouver un emploi après une pause', emoji: '🔁' },
  { id: 'developper-competences', label: 'Développer mes compétences', emoji: '🧠' },
  { id: 'bilan-competences', label: 'Faire un bilan de compétences', emoji: '🧭' },
  { id: 'stage', label: 'Trouver un stage', emoji: '📋' },
  {
    id: 'retraite-active',
    label: 'Reprendre une activité (retraite active)',
    emoji: '⏳',
  },
];

export const FORM_STEPS = [
  'personal',
  'currentProfile',
  'educationDetails',
  'experience',
  'goal',
  'targetRole',
  'skills',
] as const;

export function getOptionLabel<T extends string>(
  options: SelectOption<T>[],
  id: T | null
): string {
  if (!id) return '—';
  return options.find((o) => o.id === id)?.label ?? '—';
}
