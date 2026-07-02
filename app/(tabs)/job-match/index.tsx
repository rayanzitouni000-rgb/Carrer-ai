import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, SlidersHorizontal } from 'lucide-react-native';
import * as Linking from 'expo-linking';

import {
  LoadingSpinner,
  PressableScale,
  SearchInput,
  Text,
  useTheme,
} from '@/design-system';
import { JobOfferCard } from '@/components/jobMatch/JobOfferCard';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useSavedJobs } from '@/hooks/useSavedJobs';

export default function JobMatchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filters, setFilters, results, isLoading } = useJobSearch();
  const { isJobSaved, toggleSaveJob, savedJobsCount, trackApplicationFromMatch } = useSavedJobs();

  const navigateToDetail = (id: string, section?: string) => {
    router.push({
      pathname: './job-detail',
      params: { id, ...(section ? { section } : {}) },
    });
  };

  const handleApply = async (offer: (typeof results)[number]) => {
    if (offer.sourceUrl) {
      await trackApplicationFromMatch();
      await Linking.openURL(offer.sourceUrl);
      return;
    }
    navigateToDetail(offer.id);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 8 }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing['4'] }]}>
        <View style={styles.titleRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            Job Match
          </Text>
          <PressableScale scale={0.92} onPress={() => router.push('./saved')}>
            <View style={[styles.savedBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Heart size={18} color={theme.colors.status.danger} />
              {savedJobsCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.status.danger, borderRadius: theme.radius.full }]}>
                  <Text variant="caption" color="#FFFFFF">
                    {savedJobsCount}
                  </Text>
                </View>
              )}
            </View>
          </PressableScale>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <SearchInput
              placeholder="Rechercher un poste ou une entreprise..."
              value={filters.query}
              onChangeText={(query) => setFilters({ query })}
            />
          </View>
          <PressableScale scale={0.92} onPress={() => router.push('./filters')}>
            <View style={[styles.filterBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <SlidersHorizontal size={18} color={theme.colors.text.primary} />
            </View>
          </PressableScale>
        </View>

        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          {isLoading ? 'Recherche en cours...' : `${results.length} offre${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={results}
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
                Aucune offre ne correspond à tes critères
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary} align="center">
                Essaie d'élargir tes filtres ou de modifier ta recherche.
              </Text>
              <PressableScale scale={0.96} onPress={() => router.push('./filters')}>
                <Text variant="label" color={theme.colors.brand.primaryLight}>
                  Modifier les filtres
                </Text>
              </PressableScale>
            </View>
          }
          renderItem={({ item, index }) => (
            <JobOfferCard
              offer={item}
              index={index}
              isSaved={isJobSaved(item.id)}
              onToggleSave={() => toggleSaveJob(item.id)}
              onPress={() => navigateToDetail(item.id)}
              onApply={() => void handleApply(item)}
              onAnalyze={() => navigateToDetail(item.id, 'skills')}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { gap: 12, marginBottom: 8 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchField: { flex: 1 },
  filterBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: 12, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { gap: 12, paddingTop: 48, paddingHorizontal: 24 },
});
