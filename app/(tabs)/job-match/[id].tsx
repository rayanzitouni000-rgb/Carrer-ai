import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin, Sparkles, CheckCircle2 } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';

import {
  Icon,
  LoadingSpinner,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  SkillBadge,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import type { CareerProfile } from '@/features/career-onboarding/types';
import { useApplicationTracking } from '@/hooks/useApplicationTracking';
import { useJobOffer } from '@/hooks/useJobOffer';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { careerProfileStore } from '@/services/careerProfileStore';
import { normalizeRouteId } from '@/utils/jobOfferResolver';
import { calculateMatchScore, formatSalaryRange, getCompanyColor, getCompanyInitials } from '@/utils/matchScoreCalculator';

function skillMatchesProfile(skill: string, profile: CareerProfile): boolean {
  const normalized = skill.toLowerCase();
  return profile.skills.some((item) => {
    const label = item.label.toLowerCase();
    return label.includes(normalized) || normalized.includes(label);
  });
}

export default function JobDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const scrollRef = useRef<ScrollView>(null);
  const params = useLocalSearchParams<{ id: string; section?: string }>();
  const id = normalizeRouteId(params.id);
  const section = Array.isArray(params.section) ? params.section[0] : params.section;

  const { offer, isLoading } = useJobOffer(id);
  const { isJobSaved, toggleSaveJob, trackApplicationFromMatch } = useSavedJobs();
  const { addApplication, hasAppliedToJob } = useApplicationTracking();
  const { addInterview } = useRealInterviews();

  const profile = useMemo(() => careerProfileStore.get(), []);
  const matchScore = offer ? calculateMatchScore(profile, offer) : 0;
  const alreadyApplied = offer ? hasAppliedToJob(offer.id) : false;

  useEffect(() => {
    if (section === 'skills') {
      const timer = setTimeout(() => scrollRef.current?.scrollTo({ y: 420, animated: true }), 300);
      return () => clearTimeout(timer);
    }
  }, [section]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <Text variant="title" color={theme.colors.text.primary}>
          Offre introuvable
        </Text>
        <OutlineButton label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const saved = isJobSaved(offer.id);
  const logoColor = getCompanyColor(offer.company);

  const handleApply = async () => {
    if (offer.sourceUrl) {
      await trackApplicationFromMatch();
      await Linking.openURL(offer.sourceUrl);
    }
  };

  const handleMarkApplied = async () => {
    if (alreadyApplied) return;

    addApplication({
      company: offer.company,
      jobTitle: offer.title,
      jobOfferId: offer.id,
    });

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.show({
      type: 'success',
      title: 'Candidature enregistrée',
      message: `${offer.company} — ${offer.title}`,
    });
  };

  const handlePrepareInterview = async () => {
    await addInterview({ company: offer.company, jobTitle: offer.title });
    router.push({
      pathname: '/(tabs)/interview-simulator/session',
      params: { jobOfferId: offer.id },
    } as unknown as Href);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: theme.spacing['4'],
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
          <PressableScale scale={0.92} onPress={() => toggleSaveJob(offer.id)}>
            <View style={[styles.iconBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Heart size={18} color={saved ? theme.colors.status.danger : theme.colors.text.secondary} fill={saved ? theme.colors.status.danger : 'transparent'} />
            </View>
          </PressableScale>
        </View>

        <View style={styles.headerBlock}>
          <View style={[styles.logo, { backgroundColor: `${logoColor}22` }]}>
            <Text variant="title" color={logoColor}>
              {getCompanyInitials(offer.company)}
            </Text>
          </View>
          <Text variant="h2" color={theme.colors.text.primary}>
            {offer.title}
          </Text>
          <Text variant="body" color={theme.colors.text.secondary}>
            {offer.company}
          </Text>
          <View style={styles.metaRow}>
            <MapPin size={14} color={theme.colors.text.muted} />
            <Text variant="bodySmall" color={theme.colors.text.muted}>
              {offer.location} · {offer.contractType}
            </Text>
          </View>
          <Text variant="bodySmall" color={theme.colors.text.primary}>
            {formatSalaryRange(offer.salaryMin, offer.salaryMax, offer.contractType)}
          </Text>
        </View>

        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.matchBanner, { borderRadius: theme.radius.lg }]}
        >
          <Sparkles size={18} color="#FFFFFF" />
          <Text variant="title" color="#FFFFFF">
            {matchScore}% de correspondance IA
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text variant="h3" color={theme.colors.text.primary}>
            Description
          </Text>
          <Text variant="body" color={theme.colors.text.secondary}>
            {offer.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="h3" color={theme.colors.text.primary}>
            Compétences requises
          </Text>
          <View style={styles.skillsRow}>
            {offer.requiredSkills.map((skill) => (
              <SkillBadge
                key={skill}
                label={skill}
                variant={skillMatchesProfile(skill, profile) ? 'success' : 'default'}
              />
            ))}
          </View>
        </View>

        <PrimaryButton
          label={offer.sourceUrl ? 'Postuler sur le site' : 'Lien non disponible'}
          fullWidth
          disabled={!offer.sourceUrl}
          onPress={() => void handleApply()}
        />

        {alreadyApplied ? (
          <View
            style={[
              styles.appliedBanner,
              {
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                borderColor: theme.colors.status.success,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <CheckCircle2 size={20} color={theme.colors.status.success} />
            <Text variant="button" color={theme.colors.status.success}>
              Candidature enregistrée
            </Text>
          </View>
        ) : (
          <OutlineButton label="J'ai postulé" fullWidth onPress={() => void handleMarkApplied()} />
        )}

        <OutlineButton label="🎤 Préparer un entretien" fullWidth onPress={() => void handlePrepareInterview()} />

        <OutlineButton
          label="✉️ Générer une lettre de motivation"
          fullWidth
          onPress={() =>
            router.push({
              pathname: '/cover-letter',
              params: { jobOfferId: offer.id },
            } as never)
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlock: { gap: 8 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  section: { gap: 10 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
});
