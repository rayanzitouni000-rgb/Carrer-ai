import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { Icon, PressableScale, Text, useTheme } from '@/design-system';
import { JobOfferCard } from '@/components/jobMatch/JobOfferCard';
import { useApplicationTracking } from '@/hooks/useApplicationTracking';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { enrichOffersWithMatchScore } from '@/utils/matchScoreCalculator';
import { careerProfileStore } from '@/services/careerProfileStore';

export default function SavedJobsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedJobs, isJobSaved, toggleSaveJob } = useSavedJobs();
  const { hasAppliedToJob } = useApplicationTracking();

  const offers = useMemo(() => {
    const profile = careerProfileStore.get();
    const resolved = savedJobs.map((saved) => saved.jobOffer);
    return enrichOffersWithMatchScore(profile, resolved);
  }, [savedJobs]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 8 }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing['4'] }]}>
        <PressableScale scale={0.92} onPress={() => router.back()}>
          <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
            <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
          </View>
        </PressableScale>
        <Text variant="h2" color={theme.colors.text.primary}>
          Offres sauvegardées
        </Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingHorizontal: theme.spacing['4'],
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="title" color={theme.colors.text.primary} align="center">
              Aucune offre sauvegardée pour l'instant
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary} align="center">
              Appuie sur Save sur une offre pour la retrouver ici.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <JobOfferCard
            offer={item}
            index={index}
            isSaved={isJobSaved(item.id)}
            hasApplied={hasAppliedToJob(item.id)}
            onToggleSave={() => toggleSaveJob(item)}
            onPress={() =>
              router.push({ pathname: '/(tabs)/job-match/[id]', params: { id: item.id } })
            }
            onApply={() =>
              router.push({ pathname: '/(tabs)/job-match/[id]', params: { id: item.id } })
            }
            onAnalyze={() =>
              router.push({
                pathname: '/(tabs)/job-match/[id]',
                params: { id: item.id, section: 'skills' },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: 12, paddingTop: 8 },
  empty: { gap: 12, paddingTop: 48, paddingHorizontal: 24 },
});
