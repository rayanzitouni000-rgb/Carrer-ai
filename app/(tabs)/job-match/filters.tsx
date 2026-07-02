import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  Input,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSearchPreferences } from '@/hooks/useJobSearchPreferences';
import {
  CONTRACT_TYPE_OPTIONS,
  DATE_POSTED_OPTIONS,
  RADIUS_OPTIONS,
  type JobSearchFilters,
} from '@/types/jobMatch';

export default function JobMatchFiltersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useJobSearch();
  const { preferences } = useJobSearchPreferences();

  const [local, setLocal] = useState<JobSearchFilters>(filters);

  useFocusEffect(
    useCallback(() => {
      setLocal({
        ...filters,
        location: filters.location || preferences.locationLabel || preferences.location,
      });
    }, [filters, preferences.location, preferences.locationLabel])
  );

  const toggleContractType = (type: string) => {
    setLocal((prev) => ({
      ...prev,
      contractTypes: prev.contractTypes.includes(type)
        ? prev.contractTypes.filter((item) => item !== type)
        : [...prev.contractTypes, type],
    }));
  };

  const applyFilters = () => {
    setFilters(local);
    router.back();
  };

  const handleReset = () => {
    resetFilters();
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 8 }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing['4'] }]}>
        <PressableScale scale={0.92} onPress={() => router.back()}>
          <Text variant="label" color={theme.colors.brand.primaryLight}>
            Annuler
          </Text>
        </PressableScale>
        <Text variant="h3" color={theme.colors.text.primary}>
          Filtres
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing['4'], paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Type de contrat
          </Text>
          <View style={styles.chips}>
            {CONTRACT_TYPE_OPTIONS.map((type) => {
              const selected = local.contractTypes.includes(type);
              return (
                <PressableScale key={type} scale={0.96} onPress={() => toggleContractType(type)}>
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                        borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                        borderRadius: theme.radius.full,
                      },
                    ]}
                  >
                    <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                      {type}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <Input
          label="Localisation"
          placeholder="Paris, Lyon, Bordeaux..."
          value={local.location}
          onChangeText={(location) => setLocal((prev) => ({ ...prev, location }))}
          leftIcon="location-outline"
        />

        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Rayon
          </Text>
          <View style={styles.chips}>
            {RADIUS_OPTIONS.map((option) => {
              const selected = local.radius === option.value;
              return (
                <PressableScale
                  key={option.value}
                  scale={0.96}
                  onPress={() => setLocal((prev) => ({ ...prev, radius: option.value }))}
                >
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                        borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                        borderRadius: theme.radius.full,
                      },
                    ]}
                  >
                    <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                      {option.label}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <View style={[styles.toggleRow, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.lg }]}>
          <View style={styles.flex}>
            <Text variant="title" color={theme.colors.text.primary}>
              Télétravail uniquement
            </Text>
            <Text variant="caption" color={theme.colors.text.muted}>
              Afficher seulement les offres remote ou hybrides
            </Text>
          </View>
          <Switch
            value={local.remoteOnly}
            onValueChange={(remoteOnly) => setLocal((prev) => ({ ...prev, remoteOnly }))}
            trackColor={{ true: theme.colors.brand.primary, false: theme.colors.border.default }}
          />
        </View>

        <Input
          label="Salaire minimum (€/an)"
          placeholder="Ex: 40000"
          keyboardType="numeric"
          value={local.minSalary ? String(local.minSalary) : ''}
          onChangeText={(text) => {
            const parsed = Number(text.replace(/\s/g, ''));
            setLocal((prev) => ({
              ...prev,
              minSalary: text.trim() === '' || Number.isNaN(parsed) ? undefined : parsed,
            }));
          }}
        />

        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Date de publication
          </Text>
          <View style={styles.chips}>
            {DATE_POSTED_OPTIONS.map((option) => {
              const selected = local.datePosted === option.id;
              return (
                <PressableScale
                  key={option.id}
                  scale={0.96}
                  onPress={() => setLocal((prev) => ({ ...prev, datePosted: option.id }))}
                >
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                        borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                        borderRadius: theme.radius.full,
                      },
                    ]}
                  >
                    <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                      {option.label}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <PrimaryButton label="Appliquer les filtres" fullWidth onPress={applyFilters} />
        <OutlineButton label="Réinitialiser" fullWidth onPress={handleReset} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerSpacer: { width: 56 },
  content: { gap: 20 },
  section: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  flex: { flex: 1, gap: 4 },
});
