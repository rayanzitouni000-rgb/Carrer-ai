import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Briefcase, PencilLine } from 'lucide-react-native';

import { AiFormSelect } from '@/components/onboarding/AiFormSelect';
import { PaywallScreen, PremiumBadge } from '@/components/premium';
import {
  Icon,
  IconName,
  Input,
  PressableScale,
  ScreenContainer,
  Text,
  useTheme,
} from '@/design-system';
import { getJobOfferById } from '@/utils/jobOfferResolver';
import { useCoverLetterGenerator } from '@/hooks/useCoverLetterGenerator';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useSavedJobs } from '@/hooks/useSavedJobs';

const MANUAL_JOB_ID = 'manual';

interface ModeCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: readonly [string, string];
  isPremiumFeature?: boolean;
  onPress: () => void;
}

function ModeCard({ title, subtitle, icon, gradient, isPremiumFeature, onPress }: ModeCardProps) {
  const theme = useTheme();

  return (
    <PressableScale scale={0.98} onPress={onPress}>
      <View
        style={[
          styles.card,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconWrap, { borderRadius: theme.radius.md }]}
        >
          <Icon name={icon} size="md" color="#FFFFFF" />
        </LinearGradient>

        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text variant="title" color={theme.colors.text.primary}>
              {title}
            </Text>
            {isPremiumFeature && <PremiumBadge />}
          </View>
          <Text variant="caption" color={theme.colors.text.secondary}>
            {subtitle}
          </Text>
        </View>

        <Icon name="chevron-forward" size="sm" color={theme.colors.text.muted} />
      </View>
    </PressableScale>
  );
}

export default function CoverLetterIndexScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { jobOfferId } = useLocalSearchParams<{ jobOfferId?: string }>();
  const { isPremium } = usePremiumStatus();
  const { savedJobs } = useSavedJobs();
  const { data, updateField, loadFromJobOffer, resetDraft } = useCoverLetterGenerator();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(MANUAL_JOB_ID);

  const lockedOffer = jobOfferId ? getJobOfferById(jobOfferId) : undefined;
  const isLocked = Boolean(lockedOffer);

  useEffect(() => {
    if (jobOfferId && lockedOffer) {
      loadFromJobOffer(jobOfferId);
      return;
    }
    resetDraft();
  }, [jobOfferId, lockedOffer?.id, loadFromJobOffer, resetDraft]);

  useEffect(() => {
    if (jobOfferId) return;
    if (savedJobs.length > 0) {
      const firstId = savedJobs[0].jobOffer.id;
      setSelectedJobId(firstId);
      loadFromJobOffer(firstId);
      return;
    }
    setSelectedJobId(MANUAL_JOB_ID);
  }, [jobOfferId, savedJobs, loadFromJobOffer]);

  const jobOptions = useMemo(() => {
    const savedOptions = savedJobs.map((saved) => ({
      id: saved.jobOffer.id,
      label: `${saved.jobOffer.title} — ${saved.jobOffer.company}`,
      icon: Briefcase,
    }));

    return [...savedOptions, { id: MANUAL_JOB_ID, label: 'Saisir manuellement', icon: PencilLine }];
  }, [savedJobs]);

  const handleJobSelect = (id: string) => {
    setSelectedJobId(id);
    if (id === MANUAL_JOB_ID) {
      updateField('jobOfferId', '');
      updateField('jobTitle', '');
      updateField('company', '');
      return;
    }
    loadFromJobOffer(id);
  };

  const canContinue = data.jobTitle.trim().length > 0 && data.company.trim().length > 0;

  const handleGuidedMode = () => {
    if (!canContinue) return;
    router.push('/cover-letter/template' as Href);
  };

  const handleAiMode = () => {
    if (!canContinue) return;
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
    router.push('/cover-letter/generate' as Href);
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Lettre de motivation">
      <Text variant="body" color={theme.colors.text.secondary} style={styles.intro}>
        Choisis comment rédiger ta lettre pour ce poste.
      </Text>

      {isLocked && lockedOffer ? (
        <View
          style={[
            styles.contextCard,
            {
              backgroundColor: theme.colors.card.elevated,
              borderColor: theme.colors.border.subtle,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <Text variant="label" color={theme.colors.text.muted}>
            Poste visé
          </Text>
          <Text variant="title" color={theme.colors.text.primary}>
            {lockedOffer.title}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {lockedOffer.company}
          </Text>
        </View>
      ) : (
        <View style={styles.jobSection}>
          <AiFormSelect
            mode="single"
            label="Pour quel poste ?"
            options={jobOptions}
            selectedId={selectedJobId}
            onSelect={handleJobSelect}
          />

          {selectedJobId === MANUAL_JOB_ID && (
            <View style={styles.manualFields}>
              <Input
                label="Entreprise"
                placeholder="Ex: Doctolib"
                value={data.company}
                onChangeText={(value) => updateField('company', value)}
              />
              <Input
                label="Poste"
                placeholder="Ex: Développeur Full-stack"
                value={data.jobTitle}
                onChangeText={(value) => updateField('jobTitle', value)}
              />
            </View>
          )}
        </View>
      )}

      <View style={styles.cards}>
        <ModeCard
          title="Modèle guidé"
          subtitle="Choisis des phrases types et personnalise-les"
          icon="create-outline"
          gradient={['#1D4ED8', '#1D4ED8']}
          onPress={handleGuidedMode}
        />
        <ModeCard
          title="Génération IA"
          subtitle="Lettre entièrement rédigée par l'IA (Premium)"
          icon="sparkles-outline"
          gradient={['#2B6CFF', '#EC4899']}
          isPremiumFeature
          onPress={handleAiMode}
        />
      </View>

      {!canContinue && (
        <Text variant="caption" color={theme.colors.text.muted} align="center">
          Renseigne le poste et l'entreprise pour continuer.
        </Text>
      )}

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="cover_letter_ai"
        onClose={() => setPaywallVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: 4 },
  contextCard: {
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  jobSection: { gap: 12 },
  manualFields: { gap: 12 },
  cards: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
});
