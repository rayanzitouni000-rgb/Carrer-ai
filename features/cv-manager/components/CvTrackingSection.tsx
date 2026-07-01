import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import {
  Card,
  Icon,
  Input,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';

import { useCvTracking } from '@/hooks/useCvTracking';
import type { CvSentEntry } from '@/types/cvTracking';

function formatEntryDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CounterCard({ label, value }: { label: string; value: number }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.counter,
        {
          backgroundColor: theme.colors.card.default,
          borderColor: theme.colors.border.subtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="h2" color={theme.colors.brand.primaryLight}>
        {value}
      </Text>
      <Text variant="caption" color={theme.colors.text.muted} align="center">
        {label}
      </Text>
    </View>
  );
}

function EntryRow({
  entry,
  onRemove,
}: {
  entry: CvSentEntry;
  onRemove: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.entryRow,
        { borderColor: theme.colors.border.subtle, borderRadius: theme.radius.md },
      ]}
    >
      <View style={styles.entryInfo}>
        <Text variant="label" color={theme.colors.text.primary}>
          {entry.note?.trim() || 'Candidature envoyée'}
        </Text>
        <Text variant="caption" color={theme.colors.text.muted}>
          {formatEntryDate(entry.date)}
        </Text>
      </View>
      <Pressable
        onPress={() => onRemove(entry.id)}
        hitSlop={8}
        accessibilityLabel="Supprimer cette entrée"
      >
        <Icon name="close-circle-outline" size="sm" color={theme.colors.text.muted} />
      </Pressable>
    </View>
  );
}

export function CvTrackingSection() {
  const theme = useTheme();
  const { entries, todayCount, weekCount, monthCount, addEntry, removeEntry } =
    useCvTracking();
  const [note, setNote] = useState('');

  const handleAdd = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addEntry(note);
    setNote('');
  };

  const recentEntries = entries.slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="paper-plane-outline" size="sm" color={theme.colors.brand.primaryLight} />
        <Text variant="title" color={theme.colors.text.primary}>
          Suivi de mes candidatures
        </Text>
      </View>

      <View style={styles.counters}>
        <CounterCard label="Aujourd'hui" value={todayCount} />
        <CounterCard label="Cette semaine" value={weekCount} />
        <CounterCard label="Ce mois-ci" value={monthCount} />
      </View>

      <Card variant="elevated" padding="4" style={styles.actionCard}>
        <PrimaryButton
          label="+ J'ai envoyé un CV"
          onPress={handleAdd}
          fullWidth
        />
        <Input
          placeholder="Note (optionnel), ex. Candidature chez Capgemini"
          value={note}
          onChangeText={setNote}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
      </Card>

      {recentEntries.length > 0 ? (
        <View style={styles.list}>
          {recentEntries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} onRemove={removeEntry} />
          ))}
        </View>
      ) : (
        <Text variant="caption" color={theme.colors.text.muted} align="center">
          Aucun envoi pour l&apos;instant. Ajoute ta première candidature !
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counters: {
    flexDirection: 'row',
    gap: 10,
  },
  counter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 16,
    borderWidth: 1,
    minHeight: 88,
  },
  actionCard: {
    gap: 12,
  },
  list: {
    gap: 8,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderWidth: 1,
  },
  entryInfo: {
    flex: 1,
    gap: 2,
  },
});
