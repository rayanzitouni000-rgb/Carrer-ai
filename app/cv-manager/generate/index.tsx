import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { cvAnalysisContextStore } from '@/services/cvAnalysisContextStore';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

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

export default function GenerateModeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { isPremium } = usePremiumStatus();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const showComingSoon = () => {
    toast.show({
      type: 'info',
      title: 'Cette fonctionnalité arrive bientôt !',
    });
  };

  const handlePremiumCvMode = () => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }

    // TODO: utiliser cvAnalysisContextStore.get() une fois l'appel IA backend en place —
    // transmettre improvements / aiRecommendation pour personnaliser la génération.
    const _analysisContext = cvAnalysisContextStore.get();

    showComingSoon();
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Générer mon CV">
      <Text variant="body" color={theme.colors.text.secondary} style={styles.intro}>
        Choisis comment tu veux créer ton CV.
      </Text>

      <View style={styles.cards}>
        <ModeCard
          title="Remplir un formulaire"
          subtitle="Complète tes infos et génère un PDF propre immédiatement"
          icon="create-outline"
          gradient={['#2563EB', '#6366F1']}
          onPress={() => router.push('/cv-manager/generate/form')}
        />

        {/* TODO: nécessite le backend — appel API qui génère le contenu du CV
            à partir du profil utilisateur (experiences, skills, targetRoles,
            educationLevel déjà collectés dans l'onboarding) */}
        <ModeCard
          title="Laisser l'IA rédiger mon CV"
          subtitle="L'IA rédige ton CV à partir de ton profil"
          icon="sparkles-outline"
          gradient={['#8B5CF6', '#EC4899']}
          isPremiumFeature
          onPress={handlePremiumCvMode}
        />

        {/* TODO: nécessite le backend — upload du CV existant (PDF/DOCX),
            extraction du contenu, puis appel IA pour reformuler/améliorer
            et régénérer un nouveau CV structuré */}
        <ModeCard
          title="Générer à partir d'un CV existant"
          subtitle="Importe ton CV actuel, l'IA le reformule et l'améliore"
          icon="cloud-upload-outline"
          gradient={['#F59E0B', '#EF4444']}
          isPremiumFeature
          onPress={handlePremiumCvMode}
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
