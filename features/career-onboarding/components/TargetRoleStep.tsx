import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Input, Text, useTheme } from '@/design-system';

import { JOB_ROLES, MAX_TARGET_ROLES, searchJobRoles } from '../data/jobRolesData';
import type { CareerProfile } from '../types';

interface TargetRoleStepProps {
  profile: CareerProfile;
  onChange: (partial: Partial<CareerProfile>) => void;
}

export function TargetRoleStep({ profile, onChange }: TargetRoleStepProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const trimmedQuery = searchQuery.trim();
  const targetRoles = profile.targetRoles ?? [];
  const atMax = targetRoles.length >= MAX_TARGET_ROLES;

  const searchResults = useMemo(
    () => searchJobRoles(searchQuery, targetRoles),
    [searchQuery, targetRoles]
  );

  const addRole = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed || atMax) return;
    if (targetRoles.some((role) => role.toLowerCase() === trimmed.toLowerCase())) return;
    onChange({ targetRoles: [...targetRoles, trimmed] });
    setSearchQuery('');
  };

  const removeRole = (label: string) => {
    onChange({ targetRoles: targetRoles.filter((role) => role !== label) });
  };

  return (
    <View style={styles.container}>
      <Text variant="h2" color={theme.colors.text.primary}>
        Quel(s) poste(s) vises-tu ?
      </Text>
      <Text variant="body" color={theme.colors.text.secondary}>
        Pour des entretiens et un CV vraiment ciblés
      </Text>

      <Card variant="elevated" padding="5" style={styles.card}>
        <Input
          placeholder="Rechercher un intitulé de poste..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          editable={!atMax}
          accessibilityHint="Recherche parmi les intitulés de poste courants"
        />

        {trimmedQuery.length > 0 && !atMax && (
          <View
            style={[
              styles.searchPanel,
              {
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            {searchResults.map((role) => (
              <Pressable
                key={role.id}
                onPress={() => addRole(role.label)}
                style={styles.searchRow}
                accessibilityRole="button"
                accessibilityLabel={`Ajouter ${role.label}`}
              >
                <Text variant="body" color={theme.colors.text.primary}>
                  {role.label}
                </Text>
              </Pressable>
            ))}

            {searchResults.length === 0 && trimmedQuery.length > 1 && (
              <Pressable
                onPress={() => {
                  // TODO: reformulation IA du texte custom une fois le backend prêt
                  addRole(trimmedQuery);
                }}
                style={styles.searchRow}
                accessibilityRole="button"
              >
                <Text variant="body" color={theme.colors.brand.primary}>
                  + Ajouter « {trimmedQuery} » comme intitulé personnalisé
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {atMax && (
          <Text variant="caption" color={theme.colors.text.muted}>
            Maximum {MAX_TARGET_ROLES} postes atteint
          </Text>
        )}

        {targetRoles.length > 0 && (
          <View style={styles.tagsSection}>
            <Text variant="label" color={theme.colors.text.secondary}>
              Postes sélectionnés ({targetRoles.length}/{MAX_TARGET_ROLES})
            </Text>
            <View style={styles.tags}>
              {targetRoles.map((role) => (
                <View
                  key={role}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: 'rgba(59, 130, 246, 0.14)',
                      borderColor: theme.colors.brand.primary,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                >
                  <Text variant="caption" color={theme.colors.brand.primary}>
                    {role}
                  </Text>
                  <Pressable
                    onPress={() => removeRole(role)}
                    hitSlop={8}
                    accessibilityLabel={`Retirer ${role}`}
                  >
                    <Text variant="caption" color={theme.colors.text.muted}>
                      ✕
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {targetRoles.length === 0 && trimmedQuery.length === 0 && (
          <View style={styles.hintSection}>
            <Text variant="caption" color={theme.colors.text.muted}>
              Exemples : {JOB_ROLES.slice(0, 4).map((r) => r.label).join(' · ')}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    gap: 16,
    marginTop: 4,
  },
  searchPanel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tagsSection: {
    gap: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  hintSection: {
    marginTop: 4,
  },
});
