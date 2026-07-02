import {
  Code,
  Factory,
  GraduationCap,
  Hammer,
  HardHat,
  Heart,
  HelpCircle,
  Landmark,
  Megaphone,
  Scale,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from 'lucide-react-native';

import type { SelectOption } from '@/types/onboarding';

export const SECTEURS_ACTIVITE: SelectOption[] = [
  { id: 'tech', label: 'Tech / Informatique', icon: Code },
  { id: 'commerce', label: 'Commerce / Vente', icon: ShoppingBag },
  { id: 'sante', label: 'Santé', icon: Heart },
  { id: 'finance', label: 'Finance / Banque', icon: Landmark },
  { id: 'industrie', label: 'Industrie', icon: Factory },
  { id: 'btp', label: 'BTP / Construction', icon: HardHat },
  { id: 'education', label: 'Éducation', icon: GraduationCap },
  { id: 'marketing-com', label: 'Marketing / Communication', icon: Megaphone },
  { id: 'rh', label: 'Ressources Humaines', icon: Users },
  { id: 'juridique', label: 'Juridique', icon: Scale },
  { id: 'restauration', label: 'Restauration / Hôtellerie', icon: UtensilsCrossed },
  { id: 'artisanat', label: 'Artisanat', icon: Hammer },
  { id: 'autre-secteur', label: 'Autre', icon: HelpCircle },
];
