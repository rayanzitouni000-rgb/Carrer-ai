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

interface ModeCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: readonly [string, string];
  disabled?: boolean;
  onPress: () => void;
}

function ModeCard({ title, subtitle, icon, gradient, disabled, onPress }: ModeCardProps) {
  const theme = useTheme();

  return (
    <PressableScale scale={disabled ? 1 : 0.98} onPress={onPress}>
      <View
        style={[
          styles.card,
          theme.shadows.sm,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
            opacity: disabled ? 0.55 : 1,
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
            {disabled && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: theme.colors.status.warningMuted,
                    borderRadius: theme.radius.full,
                  },
                ]}
              >
                <Text variant="caption" color={theme.colors.status.warning}>
                  Bientôt disponible
                </Text>
              </View>
            )}
          </View>
          <Text variant="caption" color={theme.colors.text.secondary}>
            {subtitle}
          </Text>
        </View>

        {!disabled && (
          <Icon name="chevron-forward" size="sm" color={theme.colors.text.muted} />
        )}
      </View>
    </PressableScale>
  );
}

export default function GenerateModeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();

  const showComingSoon = () => {
    toast.show({
      type: 'info',
      title: 'Cette fonctionnalité arrive bientôt !',
    });
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
          disabled
          onPress={showComingSoon}
        />

        {/* TODO: nécessite le backend — upload du CV existant (PDF/DOCX),
            extraction du contenu, puis appel IA pour reformuler/améliorer
            et régénérer un nouveau CV structuré */}
        <ModeCard
          title="Générer à partir d'un CV existant"
          subtitle="Importe ton CV actuel, l'IA le reformule et l'améliore"
          icon="cloud-upload-outline"
          gradient={['#F59E0B', '#EF4444']}
          disabled
          onPress={showComingSoon}
        />
      </View>
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
