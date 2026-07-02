import type { CurrentSituation } from '../types';

/** Situations où la formation en cours est décrite par les champs conditionnels. */
export const ACTIVE_STUDY_SITUATIONS: CurrentSituation[] = [
  'lyceen',
  'bac2',
  'etudiant',
  'alternant',
];

export function isActiveStudySituation(situation: CurrentSituation | null): boolean {
  return situation !== null && ACTIVE_STUDY_SITUATIONS.includes(situation);
}

/** Situations où il faut demander la formation déjà obtenue (parcours passé). */
export function requiresPastEducationInput(situation: CurrentSituation | null): boolean {
  return situation !== null && !isActiveStudySituation(situation);
}
