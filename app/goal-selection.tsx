import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { GOAL_OPTIONS } from '@/constants/mockData';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { CareerGoal } from '@/types';

export default function GoalSelectionScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenLayout title="Votre objectif" subtitle="Choisissez ce qui vous correspond">
      <View style={styles.goals}>
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <Pressable key={goal.id} onPress={() => setSelectedGoal(goal.id)}>
              <Card
                variant={isSelected ? 'elevated' : 'default'}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              >
                <View style={styles.goalRow}>
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <Ionicons
                      name={goal.icon as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.goalText}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Continuer"
        onPress={handleContinue}
        fullWidth
        disabled={!selectedGoal}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  goals: {
    gap: spacing.md,
  },
  goalCard: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalCardSelected: {
    borderColor: colors.primary,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  goalText: {
    flex: 1,
    gap: spacing.xs,
  },
  goalTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  goalDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
