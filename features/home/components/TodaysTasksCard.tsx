import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Card, Icon, Text, useTheme } from '@/design-system';

import { TODAYS_TASKS } from '../constants/mockData';

function TaskItem({ task, index }: { task: (typeof TODAYS_TASKS)[0]; index: number }) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(300 + index * 80).duration(400)}
      style={styles.taskRow}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: task.completed
              ? theme.colors.status.successMuted
              : theme.colors.card.elevated,
            borderColor: task.completed
              ? theme.colors.status.success
              : theme.colors.border.default,
            borderRadius: theme.radius.full,
          },
        ]}
      >
        {task.completed && (
          <Icon name="checkmark" size="xs" color={theme.colors.status.success} />
        )}
      </View>
      <Icon name={task.icon} size="sm" color={task.completed ? theme.colors.text.muted : theme.colors.brand.primaryLight} />
      <Text
        variant="bodySmall"
        color={task.completed ? theme.colors.text.muted : theme.colors.text.primary}
        style={[styles.taskLabel, task.completed && styles.taskDone]}
      >
        {task.label}
      </Text>
    </Animated.View>
  );
}

export function TodaysTasksCard() {
  const theme = useTheme();
  const completed = TODAYS_TASKS.filter((t) => t.completed).length;
  const total = TODAYS_TASKS.length;

  return (
    <Card variant="elevated" padding="4" style={styles.card}>
      <View style={styles.header}>
        <Text variant="title" color={theme.colors.text.primary}>
          Tâches du jour
        </Text>
        <View style={[styles.badge, { backgroundColor: theme.colors.status.successMuted, borderRadius: theme.radius.full }]}>
          <Text variant="caption" color={theme.colors.status.success}>
            {completed}/{total}
          </Text>
        </View>
      </View>

      <View style={styles.tasks}>
        {TODAYS_TASKS.map((task, index) => (
          <TaskItem key={task.id} task={task} index={index} />
        ))}
      </View>

      <View style={[styles.progressTrack, { backgroundColor: theme.colors.card.elevated, borderRadius: theme.radius.full }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(completed / total) * 100}%`,
              backgroundColor: theme.colors.brand.primary,
              borderRadius: theme.radius.full,
            },
          ]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4 },
  tasks: { gap: 12 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskLabel: { flex: 1 },
  taskDone: { textDecorationLine: 'line-through' },
  progressTrack: { height: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },
});
