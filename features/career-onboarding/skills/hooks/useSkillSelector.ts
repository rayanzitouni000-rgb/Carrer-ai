import { useCallback, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';

import type { CareerProfile } from '../../types';
import {
  getSuggestedSkillsForProfile,
  searchSkills,
  slugifySkillLabel,
} from '../data/skillsData';
import type { Skill, SkillLevel, UserSkill } from '../types';
import { MIN_USER_SKILLS } from '../types';

export interface UseSkillSelectorParams {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export interface UseSkillSelectorReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Skill[];
  suggestedSkills: Skill[];
  selectedSkills: UserSkill[];
  activeSkillId: string | null;
  pendingSkill: Skill | null;
  canContinue: boolean;
  openLevelPicker: (skill: Skill) => void;
  confirmLevel: (level: SkillLevel) => void;
  closeLevelPicker: () => void;
  removeSkill: (skillId: string) => void;
  addCustomSkill: (label: string) => void;
}

export function useSkillSelector({
  profile,
  onChange,
}: UseSkillSelectorParams): UseSkillSelectorReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [pendingSkill, setPendingSkill] = useState<Skill | null>(null);

  const selectedSkills = profile.skills;

  const persistSkills = useCallback(
    (skills: UserSkill[]) => {
      onChange({ skills });
    },
    [onChange]
  );

  const selectedIds = useMemo(
    () => selectedSkills.map((skill) => skill.id),
    [selectedSkills]
  );

  const searchResults = useMemo(
    () => searchSkills(searchQuery, selectedIds),
    [searchQuery, selectedIds]
  );

  const suggestedSkills = useMemo(() => {
    const suggestions = getSuggestedSkillsForProfile(profile.fieldOfStudy);
    const selectedSet = new Set(selectedIds);
    return suggestions.filter((skill) => !selectedSet.has(skill.id));
  }, [profile.fieldOfStudy, selectedIds]);

  const canContinue = selectedSkills.length >= MIN_USER_SKILLS;

  const closeLevelPicker = useCallback(() => {
    setActiveSkillId(null);
    setPendingSkill(null);
  }, []);

  const openLevelPicker = useCallback((skill: Skill) => {
    Keyboard.dismiss();
    setPendingSkill(skill);
    setActiveSkillId(skill.id);
  }, []);

  const confirmLevel = useCallback(
    (level: SkillLevel) => {
      if (!pendingSkill) return;

      const now = new Date().toISOString();
      const existingIndex = selectedSkills.findIndex((skill) => skill.id === pendingSkill.id);

      const nextSkill: UserSkill = {
        id: pendingSkill.id,
        label: pendingSkill.label,
        category: pendingSkill.category,
        level,
        addedAt: existingIndex >= 0 ? selectedSkills[existingIndex].addedAt : now,
      };

      const skills =
        existingIndex >= 0
          ? selectedSkills.map((skill, index) => (index === existingIndex ? nextSkill : skill))
          : [...selectedSkills, nextSkill];

      persistSkills(skills);
      setSearchQuery('');
      closeLevelPicker();
    },
    [closeLevelPicker, pendingSkill, persistSkills, selectedSkills]
  );

  const removeSkill = useCallback(
    (skillId: string) => {
      persistSkills(selectedSkills.filter((skill) => skill.id !== skillId));
      if (activeSkillId === skillId) {
        closeLevelPicker();
      }
    },
    [activeSkillId, closeLevelPicker, persistSkills, selectedSkills]
  );

  const addCustomSkill = useCallback(
    (label: string) => {
      const trimmed = label.trim();
      if (trimmed.length < 2) return;

      const baseId = slugifySkillLabel(trimmed) || 'competence';
      const customSkill: Skill = {
        id: `custom-${baseId}-${Date.now()}`,
        label: trimmed,
        category: 'other',
      };

      openLevelPicker(customSkill);
    },
    [openLevelPicker]
  );

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestedSkills,
    selectedSkills,
    activeSkillId,
    pendingSkill,
    canContinue,
    openLevelPicker,
    confirmLevel,
    closeLevelPicker,
    removeSkill,
    addCustomSkill,
  };
}
