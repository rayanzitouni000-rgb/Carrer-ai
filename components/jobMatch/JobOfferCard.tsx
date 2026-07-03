import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, MapPin, Sparkles, Wifi } from 'lucide-react-native';

import {
  OutlineButton,
  PressableScale,
  PrimaryButton,
  SkillBadge,
  Text,
  useTheme,
} from '@/design-system';
import type { JobOffer } from '@/types/jobMatch';
import {
  formatSalaryRange,
  getCompanyColor,
  getCompanyInitials,
} from '@/utils/matchScoreCalculator';

interface JobOfferCardProps {
  offer: JobOffer;
  index?: number;
  isSaved: boolean;
  hasApplied?: boolean;
  onToggleSave: () => void;
  onPress: () => void;
  onApply: () => void;
  onAnalyze: () => void;
}

export function JobOfferCard({
  offer,
  index = 0,
  isSaved,
  hasApplied = false,
  onToggleSave,
  onPress,
  onApply,
  onAnalyze,
}: JobOfferCardProps) {
  const theme = useTheme();
  const logoColor = getCompanyColor(offer.company);
  const remoteLabel = offer.remoteLabel ?? (offer.isRemote ? 'Remote' : 'Sur site');

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
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
        <PressableScale scale={0.98} onPress={onPress}>
          <View style={styles.tappable}>
            <View style={styles.headerRow}>
              <View style={[styles.logo, { backgroundColor: `${logoColor}22` }]}>
                <Text variant="label" color={logoColor}>
                  {getCompanyInitials(offer.company)}
                </Text>
              </View>

              <View style={styles.headerContent}>
                <Text variant="title" color={theme.colors.text.primary} numberOfLines={2}>
                  {offer.title}
                </Text>
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  {offer.company}
                </Text>
              </View>

              <LinearGradient
                colors={['#2B6CFF', '#2B6CFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.matchBadge, { borderRadius: theme.radius.full }]}
              >
                <Sparkles size={12} color="#FFFFFF" />
                <Text variant="caption" color="#FFFFFF">
                  {offer.matchScore}% match
                </Text>
              </LinearGradient>
            </View>

            <Text variant="bodySmall" color={theme.colors.text.primary}>
              {formatSalaryRange(offer.salaryMin, offer.salaryMax, offer.contractType)}
            </Text>

            <View style={styles.badgesRow}>
              <SkillBadge label={offer.contractType} variant="primary" />
              {hasApplied && (
                <SkillBadge label="Postulé" variant="success" />
              )}
              <View style={styles.remoteBadge}>
                {offer.isRemote ? (
                  <Wifi size={12} color={theme.colors.brand.primaryLight} />
                ) : (
                  <MapPin size={12} color={theme.colors.text.muted} />
                )}
                <Text variant="caption" color={theme.colors.text.secondary}>
                  {remoteLabel}
                </Text>
              </View>
              <Text variant="caption" color={theme.colors.text.muted}>
                {offer.location}
              </Text>
            </View>
          </View>
        </PressableScale>

        <View style={styles.actionsRow}>
            <OutlineButton
              label={isSaved ? 'Saved' : 'Save'}
              size="sm"
              leftIcon={
                <Heart
                  size={14}
                  color={isSaved ? theme.colors.status.danger : theme.colors.text.secondary}
                  fill={isSaved ? theme.colors.status.danger : 'transparent'}
                />
              }
              onPress={onToggleSave}
              style={styles.actionBtn}
            />
            <PrimaryButton label="Voir l'offre" size="sm" onPress={onApply} style={styles.actionBtn} />
            <OutlineButton label="Analyze" size="sm" onPress={onAnalyze} style={styles.actionBtn} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  tappable: { gap: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 2,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  remoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
