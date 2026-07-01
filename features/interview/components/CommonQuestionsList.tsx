import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { Card, Icon, PressableScale, Text, useTheme } from '@/design-system';

import { COMMON_QUESTIONS } from '../constants/mockData';

export function CommonQuestionsList() {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.section}>
      <Text variant="title" color={theme.colors.text.primary}>
        Common Questions
      </Text>
      {COMMON_QUESTIONS.map((item, index) => {
        const isExpanded = expandedId === item.id;
        return (
          <Animated.View key={item.id} entering={FadeInDown.delay(460 + index * 50).duration(400)} layout={Layout.springify()}>
            <PressableScale scale={0.98} onPress={() => setExpandedId(isExpanded ? null : item.id)}>
              <Card padding="4" style={[styles.card, isExpanded && { borderColor: theme.colors.brand.primary }]}>
                <View style={styles.header}>
                  <Text variant="label" color={theme.colors.text.primary} style={styles.question}>
                    {item.question}
                  </Text>
                  <Icon
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size="sm"
                    color={theme.colors.text.muted}
                  />
                </View>
                {isExpanded && (
                  <Animated.View entering={FadeInDown.duration(250)}>
                    <View style={[styles.tipBox, { backgroundColor: theme.colors.status.successMuted, borderRadius: theme.radius.sm }]}>
                      <Text variant="caption" color={theme.colors.status.success}>
                        💡 {item.tip}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </Card>
            </PressableScale>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  card: { gap: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  question: { flex: 1, fontWeight: '600' },
  tipBox: { padding: 10 },
});
