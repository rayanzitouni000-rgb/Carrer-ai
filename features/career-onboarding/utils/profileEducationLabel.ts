import { EDUCATION_LEVEL_OPTIONS, getOptionLabel } from '../constants';
import {
  getCursusLabel,
  getNiveauCursusLabel,
} from '../data/cursusSuperieurData';
import type { CareerProfile } from '../types';

/** Résumé formation pour récap onboarding et pré-remplissage CV. */
export function formatProfileEducationSummary(profile: CareerProfile): string {
  const parts: string[] = [];

  const level = getOptionLabel(EDUCATION_LEVEL_OPTIONS, profile.educationLevel);
  if (level && level !== '—') parts.push(level);

  const { currentSituation, situationDetails: d } = profile;

  if (currentSituation === 'etudiant' || currentSituation === 'alternant') {
    const cursus = getCursusLabel(d.typeCursus);
    if (cursus) parts.push(cursus);
    const niveau = getNiveauCursusLabel(d.typeCursus, d.niveauCursus);
    if (niveau) parts.push(niveau);
    if (d.masterSpecialite?.trim()) parts.push(d.masterSpecialite.trim());
  }

  if (profile.diploma.trim()) parts.push(profile.diploma.trim());

  return parts.filter(Boolean).join(' · ') || '—';
}
