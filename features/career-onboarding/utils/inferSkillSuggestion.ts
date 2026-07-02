import type { TypeCursus } from '@/types/onboarding';

import type { CareerProfile } from '../types';

export function inferSkillSuggestionKey(profile: CareerProfile): string {
  const text = [
    profile.situationDetails.masterSpecialite,
    profile.situationDetails.specialiteBacPlus2Libre,
    profile.situationDetails.filiereProLibre,
    profile.diploma,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (
    text.includes('info') ||
    text.includes('informatique') ||
    text.includes('dev') ||
    text.includes('data') ||
    text.includes('ia')
  ) {
    return 'Informatique';
  }
  if (
    text.includes('marketing') ||
    text.includes('communication') ||
    text.includes('digital')
  ) {
    return 'Marketing / Communication';
  }
  if (text.includes('finance') || text.includes('compta')) {
    return 'Finance';
  }
  if (text.includes('design') || text.includes('graphique')) {
    return 'Design / Arts';
  }
  if (text.includes('droit')) {
    return 'Droit';
  }
  if (text.includes('commerce') || text.includes('gestion') || text.includes('vente')) {
    return 'Commerce / Gestion';
  }
  if (text.includes('ingénier') || text.includes('ingenier')) {
    return 'Ingénierie';
  }
  if (text.includes('santé') || text.includes('social') || text.includes('soin')) {
    return 'Santé / Social';
  }

  const typeCursus = profile.situationDetails.typeCursus as TypeCursus | undefined;
  if (typeCursus === 'bachelor-ecole' || typeCursus === 'master-ecole') {
    return 'Commerce / Gestion';
  }

  return 'default';
}
