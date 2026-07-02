import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PressableScale, PrimaryButton, Text, useTheme } from '@/design-system';
import { InterviewSetupForm } from '@/features/interview/components';
import { careerProfileStore } from '@/services/careerProfileStore';
import type { InterviewDifficulty, InterviewSessionType } from '@/types/interviewSimulator';
import { suggestDifficultyFromSkills } from '@/utils/interviewSimulatorUtils';

export default function InterviewSetupScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const profile = useMemo(() => careerProfileStore.get(), []);
  const [targetRole, setTargetRole] = useState(profile.targetRoles[0] ?? '');
  const [type, setType] = useState<InterviewSessionType>('behavioral');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>(
    suggestDifficultyFromSkills(profile)
  );

  const canStart = targetRole.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: theme.spacing['4'],
          gap: 20,
        }}
      >
        <View style={styles.headerRow}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
          <Text variant="h2" color={theme.colors.text.primary}>
            Nouvelle simulation
          </Text>
          <View style={styles.backBtn} />
        </View>

        <InterviewSetupForm
          profile={profile}
          targetRole={targetRole}
          type={type}
          difficulty={difficulty}
          onChangeTargetRole={setTargetRole}
          onChangeType={setType}
          onChangeDifficulty={setDifficulty}
        />

        <PrimaryButton
          label="Démarrer la session"
          fullWidth
          disabled={!canStart}
          onPress={() =>
            router.push({
              pathname: './session',
              params: {
                targetRole: targetRole.trim(),
                type,
                difficulty,
              },
            })
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
