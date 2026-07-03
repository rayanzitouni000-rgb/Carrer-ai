import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import { useTheme } from '@/design-system';
import { useAppStreak } from '@/hooks/useAppStreak';

import {
  AnimatedEntrance,
  ApplicationsStatsCard,
  HomeHeader,
  LastAssessmentCard,
  ProfileSummaryCard,
  QuickActionsGrid,
  UpcomingInterviewCard,
} from '@/features/home/components';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { recordAppOpen } = useAppStreak();

  useEffect(() => {
    void recordAppOpen();
  }, [recordAppOpen]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <LinearGradient
        colors={['rgba(43, 108, 255, 0.1)', 'rgba(30, 107, 255, 0.06)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: theme.spacing['4'],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <AnimatedEntrance delay={80}>
          <LastAssessmentCard />
        </AnimatedEntrance>

        <AnimatedEntrance delay={160}>
          <ProfileSummaryCard />
        </AnimatedEntrance>

        <AnimatedEntrance delay={240}>
          <UpcomingInterviewCard />
        </AnimatedEntrance>

        <AnimatedEntrance delay={320}>
          <QuickActionsGrid />
        </AnimatedEntrance>

        <AnimatedEntrance delay={400}>
          <ApplicationsStatsCard />
        </AnimatedEntrance>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { gap: 20 },
});
