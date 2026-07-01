export type SkillCategory =
  | 'tech'
  | 'business'
  | 'creative'
  | 'soft_skills'
  | 'manual'
  | 'health_social'
  | 'other';

export type SkillLevel = 'beginner' | 'intermediate' | 'expert';

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
}

export interface UserSkill {
  id: string;
  label: string;
  category: SkillCategory;
  level: SkillLevel;
  addedAt: string;
}

export const SKILL_LEVEL_CONFIG: Record<
  SkillLevel,
  { label: string; description: string; color: string }
> = {
  beginner: {
    label: 'Débutant',
    description: 'Notions de base',
    color: '#9CA3AF',
  },
  intermediate: {
    label: 'Confirmé',
    description: 'Autonome sur la plupart des tâches',
    color: '#60A5FA',
  },
  expert: {
    label: 'Expert',
    description: "Je peux former d'autres personnes",
    color: '#2563EB',
  },
};

export const MIN_USER_SKILLS = 3;
