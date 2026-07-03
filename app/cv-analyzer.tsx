import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';
import { useRouter } from 'expo-router';

import {
  AiRecommendationsCard,
  AnalysisHistorySection,
  AnalysisLoading,
  AtsScoreCard,
  CareerScoreResult,
  CvAnalyzerHeader,
  GenerateCvCtaSection,
  ImprovementsCard,
  OverallScoreCard,
  QuickActionsSection,
  StrengthsCard,
  UploadCard,
} from '@/features/cv-analyzer/components';
import { useCvAnalysis } from '@/features/cv-analyzer/hooks';

export default function CvAnalyzerScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analysis = useCvAnalysis();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <LinearGradient
        colors={['rgba(6, 182, 212, 0.1)', 'rgba(59, 130, 246, 0.06)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: theme.spacing['4'],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
        </View>

        <CvAnalyzerHeader />

        {analysis.isIdle && (
          <UploadCard onUpload={() => void analysis.startAnalysis()} />
        )}

        {analysis.isError && analysis.errorMessage && (
          <View style={styles.errorBox}>
            <Text variant="bodySmall" color={theme.colors.status.danger}>
              {analysis.errorMessage}
            </Text>
            <PressableScale scale={0.96} onPress={analysis.reset}>
              <Text variant="label" color={theme.colors.brand.primaryLight}>
                Réessayer
              </Text>
            </PressableScale>
          </View>
        )}

        {analysis.isAnalyzing && (
          <AnalysisLoading
            progress={analysis.progress}
            currentStep={analysis.currentStep}
            fileName={analysis.fileName}
          />
        )}

        {analysis.isComplete && analysis.result && (
          <View style={styles.results}>
            <CareerScoreResult analysis={analysis.result} />

            <View style={styles.scoreRow}>
              <AtsScoreCard analysis={analysis.result} />
              <OverallScoreCard analysis={analysis.result} />
            </View>

            <View style={styles.insightsRow}>
              <StrengthsCard analysis={analysis.result} />
              <ImprovementsCard analysis={analysis.result} />
            </View>

            <AiRecommendationsCard analysis={analysis.result} />
            <GenerateCvCtaSection sourceFileName={analysis.fileName} />
            <QuickActionsSection onAnalyzeAgain={analysis.reset} />
            <AnalysisHistorySection />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { gap: 20 },
  topBar: { marginBottom: -8 },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  results: { gap: 20 },
  scoreRow: { flexDirection: 'row', gap: 12 },
  insightsRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  errorBox: { paddingVertical: 8, gap: 8 },
});
