import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';

import { CompanyBriefCard } from '@/components/interview';
import {
  Icon,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';
import { useInterviewHistory } from '@/hooks/useInterviewHistory';
import { useRealInterviews } from '@/hooks/useRealInterviews';
import type { RealInterview } from '@/types/interviewSimulator';

type InterviewTab = 'upcoming' | 'past' | 'practice';

const TABS: { id: InterviewTab; label: string }[] = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'past', label: 'Passés' },
  { id: 'practice', label: 'Entraînements libres' },
];

export default function MyInterviewsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InterviewTab>('upcoming');
  const [briefModalInterview, setBriefModalInterview] = useState<RealInterview | null>(null);
  const { interviews } = useRealInterviews();
  const { sessions } = useInterviewHistory();

  const upcomingItems = useMemo(
    () => interviews.filter((item) => item.status === 'upcoming'),
    [interviews]
  );

  const pastItems = useMemo(
    () =>
      interviews
        .filter((item) => item.status === 'past')
        .map((item) => ({
          id: item.id,
          title: item.jobTitle,
          company: item.company,
          subtitle: 'Entretien passé',
        })),
    [interviews]
  );

  const practiceItems = useMemo(
    () =>
      sessions
        .filter((session) => session.sessionSource === 'free' || session.sessionSource === 'assessment')
        .map((session) => ({
          id: session.id,
          title: session.targetRole,
          company: session.sessionSource === 'assessment' ? 'Évaluation initiale' : 'Entraînement libre',
          subtitle: session.feedback
            ? `Score ${session.feedback.overallScore}/10`
            : 'Session orale · Feedback IA',
        })),
    [sessions]
  );

  const items =
    activeTab === 'upcoming'
      ? upcomingItems
      : activeTab === 'past'
        ? pastItems
        : practiceItems;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: theme.spacing['4'],
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
          <Text variant="h2" color={theme.colors.text.primary}>
            Mes entretiens
          </Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.chips}>
          {TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <PressableScale key={tab.id} scale={0.96} onPress={() => setActiveTab(tab.id)}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? theme.colors.brand.primary : theme.colors.card.default,
                      borderColor: selected ? theme.colors.brand.primary : theme.colors.border.subtle,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                >
                  <Text variant="caption" color={selected ? '#FFFFFF' : theme.colors.text.secondary}>
                    {tab.label}
                  </Text>
                </View>
              </PressableScale>
            );
          })}
        </View>

        <View style={styles.list}>
          {items.length === 0 ? (
            <Text variant="bodySmall" color={theme.colors.text.muted} align="center">
              Aucun élément dans cette catégorie pour l&apos;instant.
            </Text>
          ) : activeTab === 'upcoming' ? (
            upcomingItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.card.elevated,
                    borderColor: theme.colors.border.subtle,
                    borderRadius: theme.radius.lg,
                  },
                ]}
              >
                <Text variant="title" color={theme.colors.text.primary}>
                  {item.jobTitle}
                </Text>
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  {item.company}
                </Text>
                <Text variant="caption" color={theme.colors.text.muted}>
                  {new Date(item.scheduledAt).toLocaleDateString('fr-FR')}
                </Text>
                {item.companyBriefing && (
                  <Pressable onPress={() => setBriefModalInterview(item)}>
                    <Text variant="caption" color={theme.colors.brand.primaryLight}>
                      🏢 Fiche disponible
                    </Text>
                  </Pressable>
                )}
              </View>
            ))
          ) : (
            items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.card.elevated,
                    borderColor: theme.colors.border.subtle,
                    borderRadius: theme.radius.lg,
                  },
                ]}
              >
                <Text variant="title" color={theme.colors.text.primary}>
                  {item.title}
                </Text>
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  {item.company}
                </Text>
                <Text variant="caption" color={theme.colors.text.muted}>
                  {item.subtitle}
                </Text>
              </View>
            ))
          )}
        </View>

        <PrimaryButton
          label="Ajouter un entretien réel"
          fullWidth
          onPress={() => router.push('/(tabs)/interview-simulator/add-interview')}
        />
        <OutlineButton
          label="Lancer une simulation libre"
          fullWidth
          onPress={() => router.push('/(tabs)/interview-simulator/setup')}
        />
      </ScrollView>

      <Modal
        visible={briefModalInterview !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBriefModalInterview(null)}
      >
        <View style={[styles.modalRoot, { backgroundColor: theme.colors.background.primary }]}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: theme.spacing['4'],
              gap: 16,
            }}
          >
            <View style={styles.modalHeader}>
              <Text variant="h3" color={theme.colors.text.primary}>
                Fiche entreprise
              </Text>
              <PressableScale scale={0.92} onPress={() => setBriefModalInterview(null)}>
                <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
                  <Icon name="close" size="sm" color={theme.colors.text.primary} />
                </View>
              </PressableScale>
            </View>

            {briefModalInterview?.companyBriefing && (
              <CompanyBriefCard
                companyName={briefModalInterview.company}
                briefing={briefModalInterview.companyBriefing}
              />
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  modalRoot: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  list: { gap: 10 },
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
});
