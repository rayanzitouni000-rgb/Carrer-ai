import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PrimaryButton, Text, useTheme } from '@/design-system';
import { CV_ANALYSIS } from '@/features/cv-analyzer/constants/mockData';
import { cvAnalysisContextStore } from '@/services/cvAnalysisContextStore';

interface GenerateCvCtaSectionProps {
  sourceFileName?: string | null;
}

export function GenerateCvCtaSection({ sourceFileName }: GenerateCvCtaSectionProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleGenerateCv = () => {
    cvAnalysisContextStore.set({
      improvements: [...CV_ANALYSIS.improvements],
      aiRecommendation: CV_ANALYSIS.aiRecommendation,
      careerScore: CV_ANALYSIS.careerScore.current,
      sourceFileName: sourceFileName ?? null,
      analyzedAt: new Date().toISOString(),
    });

    router.push('/cv-manager/generate');
  };

  return (
    <Animated.View entering={FadeInDown.delay(460).duration(500).springify()}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.12)', 'rgba(43, 108, 255, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.wrapper,
          {
            borderColor: 'rgba(139, 92, 246, 0.28)',
            borderRadius: theme.radius.xl,
          },
        ]}
      >
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.status.warningMuted,
              borderRadius: theme.radius.full,
            },
          ]}
        >
          <Text variant="caption" color={theme.colors.brand.accent}>
            ✨ Analysé par IA
          </Text>
        </View>

        <Text variant="title" color={theme.colors.text.primary}>
          ✨ Passe à l&apos;action
        </Text>

        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.description}>
          Génère un CV optimisé qui corrige les points faibles identifiés ci-dessus.
        </Text>

        <PrimaryButton label="Générer mon CV" fullWidth onPress={handleGenerateCv} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 18,
    gap: 10,
    borderWidth: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  description: {
    lineHeight: 22,
  },
});
