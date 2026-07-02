import {
  Brain,
  Briefcase,
  Compass,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  HelpCircle,
  Laptop,
  RefreshCw,
  Rocket,
  RotateCcw,
  TrendingUp,
} from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';
import type { CareerGoalId } from '../types';

export const CAREER_GOALS: SelectOption[] = [
  { id: 'premier-emploi', label: 'Décrocher mon premier emploi', icon: Rocket },
  { id: 'reconversion', label: 'Me reconvertir', icon: RefreshCw },
  { id: 'evoluer-poste', label: 'Évoluer dans mon poste actuel', icon: TrendingUp },
  { id: 'meilleur-emploi', label: 'Trouver un meilleur emploi', icon: Briefcase },
  { id: 'augmenter-salaire', label: 'Augmenter mon salaire', icon: DollarSign },
  { id: 'opportunites-etranger', label: "Trouver des opportunités à l'étranger", icon: Globe },
  {
    id: 'reussite-etudes',
    label: "Réussir mes études / préparer ma sortie d'école",
    icon: GraduationCap,
  },
  { id: 'freelance', label: 'Me lancer en freelance', icon: Laptop },
  { id: 'creer-entreprise', label: 'Créer mon entreprise', icon: Rocket },
  { id: 'alternance', label: 'Trouver une alternance', icon: Handshake },
  { id: 'retour-apres-pause', label: 'Retrouver un emploi après une pause', icon: RotateCcw },
  { id: 'developper-competences', label: 'Développer mes compétences', icon: Brain },
  { id: 'bilan-competences', label: 'Faire un bilan de compétences', icon: Compass },
  { id: 'stage', label: 'Trouver un stage', icon: FileText },
  { id: 'retraite-active', label: 'Reprendre une activité (retraite active)', icon: RotateCcw },
];

export function getCareerGoalOption(id: CareerGoalId | null): SelectOption | undefined {
  if (!id) return undefined;
  return CAREER_GOALS.find((option) => option.id === id) ?? {
    id,
    label: id,
    icon: HelpCircle,
  };
}
