import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AiStepHeader } from '@/components/aiCharacter';
import { AiFormSelect } from '@/components/onboarding';
import { Card } from '@/design-system';

import { ONBOARDING_AI_MESSAGES } from '../constants/aiCharacterMessages';
import {
  buildJobRoleSelectOptions,
  jobRoleIdToLabel,
  jobRoleLabelToId,
  labelsToRoleIds,
  MAX_TARGET_ROLES,
} from '../data/jobRolesData';
import type { CareerProfile } from '../types';

interface TargetRoleStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function TargetRoleStep({ profile, onChange }: TargetRoleStepProps) {
  const targetRoles = profile.targetRoles ?? [];

  const options = useMemo(() => buildJobRoleSelectOptions(targetRoles), [targetRoles]);
  const selectedIds = useMemo(() => labelsToRoleIds(targetRoles), [targetRoles]);

  const handleToggle = (id: string) => {
    const label = jobRoleIdToLabel(id);
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      onChange({
        targetRoles: targetRoles.filter((role) => jobRoleLabelToId(role) !== id),
      });
      return;
    }

    if (targetRoles.length >= MAX_TARGET_ROLES) return;
    if (targetRoles.some((role) => role.toLowerCase() === label.toLowerCase())) return;
    onChange({ targetRoles: [...targetRoles, label] });
  };

  const handleAddCustom = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed || targetRoles.length >= MAX_TARGET_ROLES) return;
    if (targetRoles.some((role) => role.toLowerCase() === trimmed.toLowerCase())) return;
    onChange({ targetRoles: [...targetRoles, trimmed] });
  };

  return (
    <View style={styles.container}>
      <AiStepHeader message={ONBOARDING_AI_MESSAGES.targetRole ?? ''} />

      <Card variant="elevated" padding="5" style={styles.card}>
        <AiFormSelect
          mode="multi"
          label="Poste(s) visé(s)"
          options={options}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          maxSelection={MAX_TARGET_ROLES}
          searchable
          onAddCustom={handleAddCustom}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    marginTop: 4,
    overflow: 'visible',
  },
});
