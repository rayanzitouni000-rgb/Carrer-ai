import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FloatingCard } from '../../animations';
import { useTheme } from '../../theme';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { CircularProgress } from '../progress';

interface CareerScoreCardProps extends ViewProps {
  score: number;
  label?: string;
  subtitle?: string;
  trend?: string;
}

export function CareerScoreCard({
  score,
  label = 'Career Score',
  subtitle = 'Basé sur votre profil et vos compétences',
  trend,
  style,
  ...props
}: CareerScoreCardProps) {
  const theme = useTheme();

  return (
    <FloatingCard style={style}>
      <LinearGradient
        colors={[...theme.colors.gradients.brandSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { borderRadius: theme.radius.xl, padding: theme.spacing['5'] }]}
        {...props}
      >
        <View style={styles.header}>
          <View>
            <Text variant="label" color="rgba(255,255,255,0.7)">
              {label}
            </Text>
            <Text variant="hero" color={theme.colors.text.primary}>
              {score}
            </Text>
          </View>
          <CircularProgress progress={score} size={72} strokeWidth={5} showLabel={false} />
        </View>
        <Text variant="bodySmall" color="rgba(255,255,255,0.75)">
          {subtitle}
        </Text>
        {trend && (
          <View style={[styles.trend, { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: theme.radius.full }]}>
            <Icon name="trending-up-outline" size="xs" color={theme.colors.status.success} />
            <Text variant="caption" color={theme.colors.status.success}>
              {trend}
            </Text>
          </View>
        )}
      </LinearGradient>
    </FloatingCard>
  );
}

interface StatisticsCardProps extends ViewProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: Parameters<typeof Icon>[0]['name'];
}

export function StatisticsCard({
  label,
  value,
  change,
  positive = true,
  icon = 'stats-chart-outline',
  style,
  ...props
}: StatisticsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        theme.shadows.sm,
        {
          backgroundColor: theme.colors.card.default,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
          padding: theme.spacing['4'],
        },
        style,
      ]}
      {...props}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.colors.status.successMuted, borderRadius: theme.radius.sm }]}>
        <Icon name={icon} size="sm" color={theme.colors.brand.primaryLight} />
      </View>
      <Text variant="caption" color={theme.colors.text.muted}>
        {label}
      </Text>
      <Text variant="h3" color={theme.colors.text.primary}>
        {value}
      </Text>
      {change && (
        <Text variant="caption" color={positive ? theme.colors.status.success : theme.colors.status.danger}>
          {change}
        </Text>
      )}
    </View>
  );
}

interface ProfileCardProps extends ViewProps {
  name: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function ProfileCard({ name, title, subtitle, badge, style, ...props }: ProfileCardProps) {
  const theme = useTheme();
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.xl,
          padding: theme.spacing['5'],
        },
        theme.shadows.md,
        style,
      ]}
      {...props}
    >
      <LinearGradient
        colors={[...theme.colors.brand.gradient]}
        style={[styles.avatar, { borderRadius: theme.radius.full }]}
      >
        <Text variant="title" color={theme.colors.text.primary}>
          {initials}
        </Text>
      </LinearGradient>
      <Text variant="h3" color={theme.colors.text.primary} align="center">
        {name}
      </Text>
      <Text variant="bodySmall" color={theme.colors.text.secondary} align="center">
        {title}
      </Text>
      {subtitle && (
        <Text variant="caption" color={theme.colors.text.muted} align="center">
          {subtitle}
        </Text>
      )}
      {badge && (
        <View style={[styles.badge, { backgroundColor: theme.colors.status.successMuted, borderRadius: theme.radius.full }]}>
          <Text variant="caption" color={theme.colors.status.success}>
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

interface CompanyCardProps extends ViewProps {
  name: string;
  industry?: string;
  employees?: string;
  rating?: number;
}

export function CompanyCard({ name, industry, employees, rating, style, ...props }: CompanyCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.rowCard,
        {
          backgroundColor: theme.colors.card.default,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
          padding: theme.spacing['4'],
        },
        style,
      ]}
      {...props}
    >
      <View style={[styles.companyLogo, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.md }]}>
        <Icon name="business-outline" size="md" color={theme.colors.brand.primaryLight} />
      </View>
      <View style={styles.flex}>
        <Text variant="title" color={theme.colors.text.primary}>
          {name}
        </Text>
        {industry && (
          <Text variant="caption" color={theme.colors.text.muted}>
            {industry}
          </Text>
        )}
        <View style={styles.meta}>
          {employees && (
            <Text variant="caption" color={theme.colors.text.secondary}>
              {employees}
            </Text>
          )}
          {rating !== undefined && (
            <View style={styles.rating}>
              <Icon name="star" size="xs" color={theme.colors.status.warning} />
              <Text variant="caption" color={theme.colors.text.secondary}>
                {rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Icon name="chevron-forward" size="sm" color={theme.colors.text.muted} />
    </View>
  );
}

interface JobCardProps extends ViewProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  tags?: string[];
  postedAt?: string;
  onPress?: () => void;
}

export function JobCard({
  title,
  company,
  location,
  salary,
  matchScore,
  tags = [],
  postedAt,
  style,
  ...props
}: JobCardProps) {
  const theme = useTheme();

  const matchColor =
    matchScore === undefined
      ? theme.colors.text.muted
      : matchScore >= 85
        ? theme.colors.status.success
        : matchScore >= 70
          ? theme.colors.status.warning
          : theme.colors.status.danger;

  return (
    <FloatingCard style={style}>
      <View
        style={[
          styles.jobCard,
          {
            backgroundColor: theme.colors.card.elevated,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
            padding: theme.spacing['4'],
          },
          theme.shadows.sm,
        ]}
        {...props}
      >
        <View style={styles.jobHeader}>
          <View style={styles.flex}>
            <Text variant="title" color={theme.colors.text.primary}>
              {title}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {company}
            </Text>
          </View>
          {matchScore !== undefined && (
            <View style={[styles.matchBadge, { backgroundColor: `${matchColor}20`, borderRadius: theme.radius.sm }]}>
              <Text variant="label" color={matchColor}>
                {matchScore}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.jobMeta}>
          <Icon name="location-outline" size="xs" color={theme.colors.text.muted} />
          <Text variant="caption" color={theme.colors.text.muted}>
            {location}
          </Text>
          {salary && (
            <>
              <Text variant="caption" color={theme.colors.text.muted}>
                ·
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                {salary}
              </Text>
            </>
          )}
        </View>

        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <SkillBadge key={tag} label={tag} />
            ))}
          </View>
        )}

        {postedAt && (
          <Text variant="caption" color={theme.colors.text.muted}>
            {postedAt}
          </Text>
        )}
      </View>
    </FloatingCard>
  );
}

interface SkillBadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function SkillBadge({ label, variant = 'default' }: SkillBadgeProps) {
  const theme = useTheme();

  const colors_map = {
    default: { bg: theme.colors.card.elevated, text: theme.colors.text.secondary },
    primary: { bg: 'rgba(43, 108, 255, 0.15)', text: theme.colors.brand.primaryLight },
    success: { bg: theme.colors.status.successMuted, text: theme.colors.status.success },
    warning: { bg: theme.colors.status.warningMuted, text: theme.colors.status.warning },
    error: { bg: theme.colors.status.dangerMuted, text: theme.colors.status.danger },
    info: { bg: 'rgba(43, 108, 255, 0.12)', text: theme.colors.status.info },
  };

  const c = colors_map[variant];

  return (
    <View style={[styles.skillBadge, { backgroundColor: c.bg, borderRadius: theme.radius.full }]}>
      <Text variant="caption" color={c.text}>
        {label}
      </Text>
    </View>
  );
}

interface AISuggestionCardProps extends ViewProps {
  title: string;
  suggestion: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AISuggestionCard({
  title,
  suggestion,
  actionLabel = 'Appliquer',
  onAction,
  style,
  ...props
}: AISuggestionCardProps) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[...theme.colors.gradients.ai]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.aiCard, { borderRadius: theme.radius.lg, padding: theme.spacing['4'] }, style]}
      {...props}
    >
      <View style={styles.aiHeader}>
        <Icon name="sparkles-outline" size="sm" color={theme.colors.text.primary} />
        <Text variant="label" color={theme.colors.text.primary}>
          {title}
        </Text>
      </View>
      <Text variant="bodySmall" color="rgba(255,255,255,0.88)">
        {suggestion}
      </Text>
      {onAction && (
        <Text variant="label" color={theme.colors.text.primary} style={styles.aiAction} onPress={onAction}>
          {actionLabel} →
        </Text>
      )}
    </LinearGradient>
  );
}

interface TimelineCardProps extends ViewProps {
  title: string;
  description: string;
  status: 'completed' | 'active' | 'locked';
  progress?: number;
  isLast?: boolean;
}

export function TimelineCard({
  title,
  description,
  status,
  progress = 0,
  isLast = false,
  style,
  ...props
}: TimelineCardProps) {
  const theme = useTheme();

  const statusColor = {
    completed: theme.colors.status.success,
    active: theme.colors.brand.primary,
    locked: theme.colors.text.muted,
  }[status];

  return (
    <View style={[styles.timelineRow, style]} {...props}>
      <View style={styles.timelineTrack}>
        <View
          style={[
            styles.timelineDot,
            {
              backgroundColor: `${statusColor}25`,
              borderColor: statusColor,
              borderRadius: theme.radius.full,
            },
          ]}
        >
          <View style={[styles.timelineDotInner, { backgroundColor: statusColor, borderRadius: theme.radius.full }]} />
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: theme.colors.border.default }]} />}
      </View>
      <View
        style={[
          styles.timelineContent,
          {
            backgroundColor: theme.colors.card.default,
            borderColor: theme.colors.border.subtle,
            borderRadius: theme.radius.lg,
            padding: theme.spacing['4'],
          },
        ]}
      >
        <Text variant="title" color={theme.colors.text.primary}>
          {title}
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          {description}
        </Text>
        {status !== 'locked' && progress > 0 && (
          <Text variant="caption" color={statusColor}>
            {Math.round(progress)}% complété
          </Text>
        )}
      </View>
    </View>
  );
}

interface PremiumBannerProps extends ViewProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPress?: () => void;
}

export function PremiumBanner({
  title = 'CareerPilot Premium',
  subtitle = 'Débloquez votre coach IA illimité et les analyses avancées',
  ctaLabel = 'Découvrir Premium',
  onPress,
  style,
  ...props
}: PremiumBannerProps) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[...theme.colors.gradients.premiumGold]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.premiumBanner,
        theme.shadows.glowPremium,
        { borderRadius: theme.radius.xl, padding: theme.spacing['5'] },
        style,
      ]}
      {...props}
    >
      <View style={styles.premiumHeader}>
        <Icon name="diamond-outline" size="lg" color={theme.colors.text.primary} />
        <View style={styles.flex}>
          <Text variant="title" color={theme.colors.text.primary}>
            {title}
          </Text>
          <Text variant="bodySmall" color="rgba(255,255,255,0.85)">
            {subtitle}
          </Text>
        </View>
      </View>
      {onPress && (
        <Text variant="button" color={theme.colors.text.primary} onPress={onPress}>
          {ctaLabel} →
        </Text>
      )}
    </LinearGradient>
  );
}

interface NotificationCardProps extends ViewProps {
  title: string;
  message: string;
  time?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
}

export function NotificationCard({
  title,
  message,
  time,
  type = 'info',
  read = false,
  style,
  ...props
}: NotificationCardProps) {
  const theme = useTheme();

  const typeConfig = {
    info: { color: theme.colors.status.info, icon: 'information-circle-outline' as const },
    success: { color: theme.colors.status.success, icon: 'checkmark-circle-outline' as const },
    warning: { color: theme.colors.status.warning, icon: 'alert-circle-outline' as const },
    error: { color: theme.colors.status.danger, icon: 'close-circle-outline' as const },
  };

  const config = typeConfig[type];

  return (
    <View
      style={[
        styles.notifCard,
        {
          backgroundColor: read ? theme.colors.card.default : theme.colors.card.elevated,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
          padding: theme.spacing['4'],
          opacity: read ? 0.75 : 1,
        },
        style,
      ]}
      {...props}
    >
      <View style={[styles.notifIcon, { backgroundColor: `${config.color}18`, borderRadius: theme.radius.sm }]}>
        <Icon name={config.icon} size="sm" color={config.color} />
      </View>
      <View style={styles.flex}>
        <Text variant="label" color={theme.colors.text.primary}>
          {title}
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary} numberOfLines={2}>
          {message}
        </Text>
        {time && (
          <Text variant="caption" color={theme.colors.text.muted}>
            {time}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  statCard: { gap: 6, borderWidth: 1, flex: 1 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  profileCard: { alignItems: 'center', gap: 8, borderWidth: 1 },
  avatar: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, marginTop: 4 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  companyLogo: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  jobCard: { gap: 10, borderWidth: 1 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  jobMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  aiCard: { gap: 8 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiAction: { marginTop: 4 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineTrack: { alignItems: 'center', width: 24 },
  timelineDot: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  timelineDotInner: { width: 8, height: 8 },
  timelineLine: { flex: 1, width: 2, marginVertical: 4 },
  timelineContent: { flex: 1, gap: 4, borderWidth: 1, marginBottom: 12 },
  premiumBanner: { gap: 12 },
  premiumHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  notifCard: { flexDirection: 'row', gap: 12, borderWidth: 1 },
  notifIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
