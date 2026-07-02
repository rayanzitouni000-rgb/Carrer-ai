import type { CoverLetterPhraseOption } from '@/types/coverLetter';

export const INTRO_OPTIONS: CoverLetterPhraseOption[] = [
  {
    id: 'intro1',
    label: 'Direct',
    template:
      'Je vous écris pour vous faire part de mon vif intérêt pour le poste de {jobTitle} au sein de {company}.',
  },
  {
    id: 'intro2',
    label: 'Accroche offre',
    template: 'Votre offre de {jobTitle} chez {company} a immédiatement retenu mon attention.',
  },
  {
    id: 'intro3',
    label: 'Personnel',
    template:
      "C'est avec grand enthousiasme que je pose ma candidature au poste de {jobTitle} chez {company}.",
  },
];

export const MOTIVATION_OPTIONS: CoverLetterPhraseOption[] = [
  {
    id: 'motiv1',
    label: 'Expérience',
    template:
      'Fort de mon expérience en tant que {mainExperience}, je suis convaincu de pouvoir apporter une réelle valeur ajoutée à votre équipe.',
  },
  {
    id: 'motiv2',
    label: 'Passion',
    template:
      "Passionné par ce domaine, j'ai développé au fil de mon parcours des compétences solides que je souhaite aujourd'hui mettre au service de {company}.",
  },
  {
    id: 'motiv3',
    label: 'Compétences',
    template:
      'Mes compétences et mon parcours correspondent précisément aux exigences de ce poste, et je suis motivé à l\'idée de rejoindre {company}.',
  },
];

export const CLOSING_OPTIONS: CoverLetterPhraseOption[] = [
  {
    id: 'closing1',
    label: 'Classique',
    template:
      "Je reste à votre disposition pour un entretien et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
  },
  {
    id: 'closing2',
    label: 'Dynamique',
    template:
      'Je serais ravi d\'échanger avec vous prochainement pour vous présenter ma candidature plus en détail.',
  },
];

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value || ''),
    template
  );
}
