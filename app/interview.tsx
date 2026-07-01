import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Icon, PressableScale, useTheme } from '@/design-system';

import {
  AiFeedbackCard,
  CommonQuestionsList,
  HeroCard,
  ImprovementAreasCard,
  InterviewHeader,
  InterviewHistorySection,
  InterviewScoreCard,
  InterviewTypesCarousel,
  LiveInterviewPreview,
  QuestionPreviewCard,
  QuickActionsBar,
  VoiceAnalysisSection,
} from '@/features/interview/components';
import { useInterviewSession } from '@/features/interview/hooks';

export default function InterviewScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const session = useInterviewSession();

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
        ref={session.scrollRef}
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

        <InterviewHeader />
        <HeroCard onStart={session.startInterview} />
        <InterviewTypesCarousel />
        <QuestionPreviewCard />
        <LiveInterviewPreview
          isLive={session.isLive}
          timer={session.timer}
          onEnd={session.endInterview}
        />
        <VoiceAnalysisSection />
        <InterviewScoreCard />
        <AiFeedbackCard />
        <ImprovementAreasCard />
        <CommonQuestionsList />
        <QuickActionsBar onStartPractice={session.startInterview} />
        <InterviewHistorySection />
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
});
