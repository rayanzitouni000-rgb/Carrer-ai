import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer, Text, useTheme } from '@/design-system';

import { CvManagerActionCard } from '@/features/cv-manager/components/CvManagerActionCard';

export default function CvManagerScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer scrollable safeAreaBottom contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          CV Manager
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Analyse et génère ton CV au même endroit.
        </Text>
      </View>

      <View style={styles.actions}>
        <CvManagerActionCard
          title="Analyser mon CV"
          subtitle="Score ATS, points forts et axes d'amélioration"
          icon="document-text-outline"
          gradient={['#2563EB', '#6366F1']}
          onPress={() => router.push('/cv-analyzer')}
        />
        <CvManagerActionCard
          title="Générer mon CV"
          subtitle="Crée un CV propre à partir de ton profil"
          icon="create-outline"
          gradient={['#06B6D4', '#3B82F6']}
          onPress={() => router.push('/cv-manager/generate')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  header: {
    gap: 6,
  },
  actions: {
    gap: 12,
  },
});
