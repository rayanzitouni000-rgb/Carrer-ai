import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card, Icon, Text, useTheme } from '@/design-system';

import { QUESTION_PREVIEW } from '../constants/mockData';

export function QuestionPreviewCard() {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(120).duration(500).springify()}>
      <Card variant="elevated" padding="4" style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.12)', borderRadius: theme.radius.sm }]}>
          <Icon name="help-circle-outline" size="sm" color={theme.colors.brand.primaryLight} />
        </View>
        <Text variant="caption" color={theme.colors.text.muted}>
          Question Preview
        </Text>
        <Text variant="h3" color={theme.colors.text.primary} style={styles.question}>
          "{QUESTION_PREVIEW.question}"
        </Text>
        <View style={[styles.tipBox, { backgroundColor: theme.colors.status.successMuted, borderRadius: theme.radius.md }]}>
          <Text variant="caption" color={theme.colors.status.success} style={styles.tipLabel}>
            AI Tip
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {QUESTION_PREVIEW.tip}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  question: { fontStyle: 'italic', lineHeight: 32 },
  tipBox: { padding: 12, gap: 4, marginTop: 4 },
  tipLabel: { fontWeight: '700', letterSpacing: 0.5 },
});
