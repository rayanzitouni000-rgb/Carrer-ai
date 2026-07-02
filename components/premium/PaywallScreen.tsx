import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Icon,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import {
  PAYWALL_CONTEXT_MESSAGES,
  PREMIUM_PRODUCTS,
  type PaywallTriggerContext,
  type PremiumProductId,
} from '@/types/premium';

import { PremiumBadge } from './PremiumBadge';

export interface PaywallScreenProps {
  visible: boolean;
  triggerContext: PaywallTriggerContext;
  onClose: () => void;
}

interface PriceCardProps {
  productId: PremiumProductId;
  onSubscribe: (productId: PremiumProductId) => void;
}

function PriceCard({ productId, onSubscribe }: PriceCardProps) {
  const theme = useTheme();
  const product = PREMIUM_PRODUCTS[productId];
  const isYearly = productId === 'premium_yearly';

  return (
    <View
      style={[
        styles.priceCard,
        theme.shadows.md,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: isYearly ? theme.colors.brand.primaryLight : theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {product.badge && (
        <View
          style={[
            styles.offerBadge,
            {
              backgroundColor: theme.colors.status.warningMuted,
              borderRadius: theme.radius.full,
            },
          ]}
        >
          <Text variant="caption" color={theme.colors.status.warning}>
            {product.badge}
          </Text>
        </View>
      )}

      <Text variant="label" color={theme.colors.text.muted}>
        {product.label}
      </Text>

      <Text variant="title" color={theme.colors.text.primary} style={styles.priceLine}>
        {product.priceLabel}
      </Text>

      {product.subtitle && (
        <Text variant="caption" color={theme.colors.text.secondary}>
          {product.subtitle}
        </Text>
      )}

      <PrimaryButton
        label="S'abonner"
        fullWidth
        size="md"
        onPress={() => onSubscribe(productId)}
        style={styles.subscribeBtn}
      />
    </View>
  );
}

export function PaywallScreen({ visible, triggerContext, onClose }: PaywallScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { simulatePurchase } = usePremiumStatus();

  const handleSubscribe = async (productId: PremiumProductId) => {
    // TODO: remplacer par purchasePackage() RevenueCat
    await simulatePurchase(productId);
    onClose();
  };

  const handleRestore = () => {
    toast.show({
      type: 'info',
      title: 'Fonctionnalité à venir',
      message: 'La restauration des achats sera disponible prochainement.',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: theme.spacing['4'],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <PressableScale scale={0.92} onPress={onClose}>
              <View
                style={[
                  styles.closeBtn,
                  { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full },
                ]}
              >
                <Icon name="close" size="sm" color={theme.colors.text.primary} />
              </View>
            </PressableScale>
          </View>

          <LinearGradient
            colors={['#F59E0B', '#EC4899', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { borderRadius: theme.radius.xl }]}
          >
            <PremiumBadge size="md" />
            <Text variant="h2" color="#FFFFFF" align="center">
              CareerPilot Premium
            </Text>
            <Text variant="body" color="rgba(255,255,255,0.9)" align="center">
              {PAYWALL_CONTEXT_MESSAGES[triggerContext]}
            </Text>
          </LinearGradient>

          <View style={styles.features}>
            <FeatureRow icon="sparkles-outline" text="Génération IA de CV illimitée" />
            <FeatureRow icon="mic-outline" text="Simulations d'entretien illimitées" />
            <FeatureRow icon="chatbubbles-outline" text="Coach IA sans limite quotidienne" />
            <FeatureRow icon="notifications-outline" text="Alertes emploi personnalisées" />
          </View>

          <View style={styles.priceCards}>
            <PriceCard productId="premium_weekly" onSubscribe={handleSubscribe} />
            <PriceCard productId="premium_yearly" onSubscribe={handleSubscribe} />
          </View>

          <Pressable onPress={handleRestore} style={styles.restoreLink}>
            <Text variant="label" color={theme.colors.text.muted}>
              Restaurer mes achats
            </Text>
          </Pressable>

          <Text variant="caption" color={theme.colors.text.muted} align="center" style={styles.disclaimer}>
            Ceci est un environnement de test — aucun paiement réel
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

function FeatureRow({ icon, text }: { icon: Parameters<typeof Icon>[0]['name']; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.featureRow}>
      <Icon name={icon} size="sm" color={theme.colors.brand.primaryLight} />
      <Text variant="bodySmall" color={theme.colors.text.primary}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { gap: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    padding: 24,
    gap: 10,
    alignItems: 'center',
  },
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceCards: {
    gap: 12,
  },
  priceCard: {
    padding: 16,
    borderWidth: 1.5,
    gap: 6,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceLine: {
    fontSize: 20,
    lineHeight: 26,
  },
  subscribeBtn: {
    marginTop: 8,
  },
  restoreLink: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  disclaimer: {
    marginTop: 4,
  },
});
