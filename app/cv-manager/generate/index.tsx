import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import {
  Icon,
  IconName,
  PressableScale,
  ScreenContainer,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import { PaywallScreen, PremiumBadge } from '@/components/premium';
import { mergeAiCvIntoProfileData } from '@/features/cv-manager/generate/mergeAiCvContent';
import { cvGeneratorStore } from '@/features/cv-manager/generate/cvGeneratorStore';
import { getApiBaseUrl, isAiApiConfigured, QUOTA_EXCEEDED_MESSAGE } from '@/constants/apiConfig';
import { incrementCvGeneratedCount } from '@/hooks/useCvActionsTracking';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { careerProfileStore } from '@/services/careerProfileStore';

interface ModeCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: readonly [string, string];
  isPremiumFeature?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

function ModeCard({
  title,
  subtitle,
  icon,
  gradient,
  isPremiumFeature,
  disabled,
  onPress,
}: ModeCardProps) {
  const theme = useTheme();

  return (
    <PressableScale scale={0.98} onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.card,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
            opacity: disabled ? 0.6 : 1,
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

export default function GenerateModeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { isPremium } = usePremiumStatus();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const showComingSoon = () => {
    toast.show({
      type: 'info',
      title: 'Cette fonctionnalité arrive bientôt !',
    });
  };

  const handleAiWriteCv = async () => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }

    const baseUrl = getApiBaseUrl();
    if (!baseUrl || !isAiApiConfigured()) {
      toast.show({ type: 'error', title: 'API non configurée' });
      return;
    }

    setIsGenerating(true);
    try {
      await careerProfileStore.hydrate();
      const profile = careerProfileStore.get();

      const response = await fetch(`${baseUrl}/api/generate-cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      const data = (await response.json()) as {
        cvContent?: Parameters<typeof mergeAiCvIntoProfileData>[1];
        error?: string;
      };

      if (response.status === 429 && data.error === 'QUOTA_EXCEEDED') {
        toast.show({ type: 'warning', title: QUOTA_EXCEEDED_MESSAGE });
        return;
      }

      if (!response.ok || !data.cvContent) {
        toast.show({
          type: 'error',
          title: data.error ?? 'Erreur lors de la génération du CV',
        });
        return;
      }

      const merged = mergeAiCvIntoProfileData(profile, data.cvContent);
      cvGeneratorStore.set(merged);
      await incrementCvGeneratedCount();
      router.push('/cv-manager/generate/form');
    } catch {
      toast.show({
        type: 'error',
        title: 'Impossible de joindre le serveur. Réessaie plus tard.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePremiumImportMode = () => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
    showComingSoon();
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Générer mon CV">
      <Text variant="body" color={theme.colors.text.secondary} style={styles.intro}>
        Choisis comment tu veux créer ton CV.
      </Text>

      {isGenerating && (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={theme.colors.brand.primaryLight} />
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            L'IA rédige ton CV…
          </Text>
        </View>
      )}

      <View style={styles.cards}>
        <ModeCard
          title="Remplir un formulaire"
          subtitle="Complète tes infos et génère un PDF propre immédiatement"
          icon="create-outline"
          gradient={['#2563EB', '#6366F1']}
          disabled={isGenerating}
          onPress={() => router.push('/cv-manager/generate/form')}
        />

        <ModeCard
          title="Laisser l'IA rédiger mon CV"
          subtitle="L'IA rédige ton CV à partir de ton profil"
          icon="sparkles-outline"
          gradient={['#8B5CF6', '#EC4899']}
          isPremiumFeature
          disabled={isGenerating}
          onPress={() => void handleAiWriteCv()}
        />

        <ModeCard
          title="Générer à partir d'un CV existant"
          subtitle="Importe ton CV actuel, l'IA le reformule et l'améliore"
          icon="cloud-upload-outline"
          gradient={['#F59E0B', '#EF4444']}
          isPremiumFeature
          disabled={isGenerating}
          onPress={handlePremiumImportMode}
        />
      </View>

      <PaywallScreen
        visible={paywallVisible}
        triggerContext="cv_ai"
        onClose={() => setPaywallVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: 4,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cards: {
    gap: 12,
  },
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
  text: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
});
