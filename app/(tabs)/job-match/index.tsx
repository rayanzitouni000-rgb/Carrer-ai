import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Heart, SlidersHorizontal } from 'lucide-react-native';

import {
  LoadingSpinner,
  PressableScale,
  SearchInput,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import { JobOfferCard } from '@/components/jobMatch/JobOfferCard';
import { PaywallScreen, PremiumBadge } from '@/components/premium';
import { useApplicationTracking } from '@/hooks/useApplicationTracking';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchPreferences } from '@/hooks/useJobSearchPreferences';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { formatLastSearchLabel } from '@/utils/jobSearchDefaults';

export default function JobMatchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    filters,
    setFilters,
    results,
    isLoading,
    isRefreshing,
    refresh,
    lastSearchAt,
    usesLiveApi,
    apiError,
  } = useJobSearch();
  const { hasBeenSet, isReady: preferencesReady } = useJobSearchPreferences();
  const { hasAppliedToJob } = useApplicationTracking();
  const { isJobSaved, toggleSaveJob, savedJobsCount } = useSavedJobs();
  const { isPremium } = usePremiumStatus();
  const toast = useToast();
  const [paywallVisible, setPaywallVisible] = useState(false);

  useEffect(() => {
    if (!preferencesReady || hasBeenSet) return;
    router.replace('/(tabs)/job-match/location-setup');
  }, [preferencesReady, hasBeenSet, router]);

  const handleJobAlerts = () => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
    toast.show({
      type: 'info',
      title: 'Alertes emploi',
      message: 'La configuration des alertes arrive bientôt.',
    });
  };

  const navigateToDetail = (id: string, section?: string) => {
    router.push({
      pathname: '/(tabs)/job-match/[id]',
      params: { id, ...(section ? { section } : {}) },
    });
  };

  const handleApply = (offer: (typeof results)[number]) => {
    navigateToDetail(offer.id);
  };

  const lastSearchLabel = formatLastSearchLabel(lastSearchAt);
  const showFullLoader = isLoading && !isRefreshing && results.length === 0;

  if (!preferencesReady || !hasBeenSet) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 8 }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing['4'] }]}>
        <View style={styles.titleRow}>
          <Text variant="h2" color={theme.colors.text.primary}>
            Job Match
          </Text>
          <View style={styles.headerActions}>
            <PressableScale scale={0.92} onPress={handleJobAlerts}>
              <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
                <Bell size={18} color={theme.colors.brand.primaryLight} />
              </View>
            </PressableScale>
            <PressableScale scale={0.92} onPress={() => router.push('./saved')}>
              <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
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
        </View>

        <PressableScale scale={0.98} onPress={handleJobAlerts}>
          <View
            style={[
              styles.alertBanner,
              {
                backgroundColor: theme.colors.card.elevated,
                borderColor: theme.colors.border.subtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <View style={styles.alertBannerLeft}>
              <Text variant="label" color={theme.colors.text.primary}>
                Alertes emploi personnalisées
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Reçois une notification quand une offre correspond à ton profil
              </Text>
            </View>
            {!isPremium && <PremiumBadge />}
          </View>
        </PressableScale>

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
          {isLoading && !isRefreshing
            ? 'Recherche en cours...'
            : `${results.length} offre${results.length > 1 ? 's' : ''} trouvée${results.length > 1 ? 's' : ''}${usesLiveApi ? ' · France Travail' : ''}`}
        </Text>
        {lastSearchLabel && (
          <Text variant="caption" color={theme.colors.text.muted}>
            {lastSearchLabel}
          </Text>
        )}
        {apiError && (
          <Text variant="caption" color={theme.colors.status.warning}>
            {apiError}
          </Text>
        )}
      </View>

      {showFullLoader ? (
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor="#8B5CF6"
              colors={['#8B5CF6']}
            />
          }
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
              hasApplied={hasAppliedToJob(item.id)}
              onToggleSave={() => toggleSaveJob(item)}
              onPress={() => navigateToDetail(item.id)}
              onApply={() => handleApply(item)}
              onAnalyze={() => navigateToDetail(item.id, 'skills')}
            />
          )}
        />
      )}

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="job_alerts"
        onClose={() => setPaywallVisible(false)}
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  alertBannerLeft: {
    flex: 1,
    gap: 2,
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
