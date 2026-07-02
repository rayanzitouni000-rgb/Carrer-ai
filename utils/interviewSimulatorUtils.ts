import type { CareerProfile } from '@/features/career-onboarding/types';
import type { SkillLevel } from '@/features/career-onboarding/skills/types';
import type {
  InterviewDifficulty,
  InterviewFeedback,
  InterviewQuestion,
  InterviewSessionType,
} from '@/types/interviewSimulator';

const QUESTION_BANK: Record<InterviewSessionType, InterviewQuestion[]> = {
  behavioral: [
    { id: 'b1', text: 'Parle-moi de toi.', tip: 'Reste concis, oriente vers le poste visé.' },
    { id: 'b2', text: 'Raconte un défi que tu as surmonté.', tip: 'Utilise la méthode STAR.' },
    { id: 'b3', text: "Pourquoi ce poste t'intéresse ?", tip: 'Lie ta réponse au profil entreprise.' },
  ],
  technical: [
    { id: 't1', text: 'Explique un projet technique récent.', tip: 'Détaille ton rôle et les résultats.' },
    { id: 't2', text: 'Comment résous-tu un bug complexe ?', tip: 'Montre ta méthode de diagnostic.' },
    { id: 't3', text: 'Quelle stack préfères-tu et pourquoi ?', tip: 'Justifie avec des cas concrets.' },
  ],
  hr: [
    { id: 'h1', text: 'Quelles sont tes attentes salariales ?', tip: 'Donne une fourchette réaliste.' },
    { id: 'h2', text: 'Quand es-tu disponible ?', tip: 'Sois clair sur tes contraintes.' },
    { id: 'h3', text: 'Quel type de management te convient ?', tip: 'Reste authentique.' },
  ],
  case_study: [
    { id: 'c1', text: 'Comment prioriserais-tu ces fonctionnalités ?', tip: 'Impact utilisateur vs effort.' },
    { id: 'c2', text: 'Propose une stratégie pour ce marché.', tip: 'Structure en étapes.' },
  ],
  leadership: [
    { id: 'l1', text: 'Comment motives-tu une équipe en difficulté ?', tip: 'Exemple concret requis.' },
    { id: 'l2', text: 'Raconte un conflit que tu as géré.', tip: 'Montre ton écoute et ta décision.' },
  ],
  mixed: [
    { id: 'm1', text: 'Présente-toi en 2 minutes.', tip: 'Profil, compétences, objectif.' },
    { id: 'm2', text: 'Quelle est ta plus grande force professionnelle ?', tip: 'Illustre avec un exemple.' },
    { id: 'm3', text: 'Où te vois-tu dans 3 ans ?', tip: 'Aligne avec le poste visé.' },
    { id: 'm4', text: 'Décris une situation où tu as dû apprendre vite.', tip: "Montre ta capacité d'adaptation." },
  ],
};

const LEVEL_SCORE: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  expert: 3,
};

export function suggestDifficultyFromSkills(profile: CareerProfile): InterviewDifficulty {
  if (profile.skills.length === 0) return 'medium';
  const average =
    profile.skills.reduce((sum, skill) => sum + LEVEL_SCORE[skill.level], 0) / profile.skills.length;
  if (average < 1.6) return 'easy';
  if (average >= 2.4) return 'hard';
  return 'medium';
}

export function getQuestionsForSession(
  type: InterviewSessionType,
  difficulty: InterviewDifficulty
): InterviewQuestion[] {
  const base = QUESTION_BANK[type] ?? QUESTION_BANK.mixed;
  const count = difficulty === 'easy' ? 2 : difficulty === 'hard' ? 4 : 3;
  return base.slice(0, count);
}

export function buildMockFeedback(answersCount: number): InterviewFeedback {
  const base = 5.5 + Math.min(answersCount, 4) * 0.6;
  const overallScore = Math.min(9.5, Math.round(base * 10) / 10);
  return {
    overallScore,
    summary: 'Bonne structure globale. Tes réponses montrent une base solide avec des axes de progression clairs.',
    strengths: ['Clarté des idées', 'Exemples concrets', 'Bonne énergie'],
    improvements: ['Réponses plus courtes', 'Quantifier davantage les résultats', 'Conclusion plus nette'],
  };
}

export function scoreToLevelLabel(score: number): string {
  if (score < 4) return 'Débutant';
  if (score <= 7) return 'Confirmé';
  return 'Avancé';
}

export function formatAssessmentLevel(score: number): string {
  return `${scoreToLevelLabel(score)} · ${score.toFixed(1)}/10`;
}
