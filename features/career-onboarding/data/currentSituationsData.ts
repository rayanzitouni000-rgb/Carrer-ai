import {
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  Handshake,
  HelpCircle,
  PauseCircle,
  RefreshCw,
  Rocket,
  School,
  Search,
  Sparkles,
} from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';
import type { CurrentSituation } from '../types';

export const CURRENT_SITUATIONS: SelectOption[] = [
  { id: 'lyceen', label: 'Lycéen(ne)', icon: School },
  { id: 'bac2', label: 'Bac+2', icon: BookOpen },
  { id: 'etudiant', label: 'Étudiant(e)', icon: GraduationCap },
  {
    id: 'etudiant-grande-ecole',
    label: 'Étudiant(e) grande école',
    icon: GraduationCap,
  },
  { id: 'alternant', label: 'Alternant(e)', icon: Handshake },
  { id: 'jeune-diplome', label: 'Jeune diplômé(e)', icon: Sparkles },
  { id: 'recherche-emploi', label: "En recherche d'emploi", icon: Search },
  { id: 'en-poste', label: 'En poste', icon: Briefcase },
  { id: 'freelance', label: 'Freelance / Indépendant(e)', icon: Briefcase },
  { id: 'sans-emploi', label: 'Sans emploi / inactif(ve)', icon: PauseCircle },
  { id: 'autre', label: 'Autre', icon: HelpCircle },
  { id: 'entrepreneur', label: 'Entrepreneur(e)', icon: Rocket },
  { id: 'reconversion', label: 'En reconversion', icon: RefreshCw },
  { id: 'pause-carriere', label: 'En pause de carrière', icon: PauseCircle },
  { id: 'retraite-actif', label: 'Retraité(e) actif(ve)', icon: Clock },
];

export function getSituationOption(id: CurrentSituation | null): SelectOption | undefined {
  if (!id) return undefined;
  return CURRENT_SITUATIONS.find((option) => option.id === id);
}

export function getSituationIcon(id: CurrentSituation | null) {
  return getSituationOption(id)?.icon ?? HelpCircle;
}
