import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Card, Icon, Text, useTheme } from '@/design-system';

import { CV_ANALYSIS } from '../constants/mockData';

interface ListCardProps {
  title: string;
  items: string[];
  icon: 'checkmark-circle-outline' | 'alert-circle-outline';
  iconColor: string;
  iconBg: string;
  delay: number;
}

function ListCard({ title, items, icon, iconColor, iconBg, delay }: ListCardProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify()} style={styles.flex}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: iconBg, borderRadius: theme.radius.sm }]}>
            <Icon name={icon} size="sm" color={iconColor} />
          </View>
          <Text variant="title" color={theme.colors.text.primary}>
            {title}
          </Text>
        </View>
        {items.map((item, index) => (
          <Animated.View
            key={item}
            entering={FadeInRight.delay(delay + index * 60).duration(350)}
            style={styles.itemRow}
          >
            <Text variant="caption" color={iconColor}>
              •
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {item}
            </Text>
          </Animated.View>
        ))}
      </Card>
    </Animated.View>
  );
}

export function StrengthsCard() {
  const theme = useTheme();
  return (
    <ListCard
      title="Strengths"
      items={CV_ANALYSIS.strengths}
      icon="checkmark-circle-outline"
      iconColor={theme.colors.status.success}
      iconBg={theme.colors.status.successMuted}
      delay={280}
    />
  );
}

export function ImprovementsCard() {
  const theme = useTheme();
  return (
    <ListCard
      title="Improvements"
      items={CV_ANALYSIS.improvements}
      icon="alert-circle-outline"
      iconColor={theme.colors.status.warning}
      iconBg={theme.colors.status.warningMuted}
      delay={320}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  itemRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingLeft: 4 },
});
