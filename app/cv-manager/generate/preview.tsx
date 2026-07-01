import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  Icon,
  OutlineButton,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
  useToast,
} from '@/design-system';

import { cvGeneratorStore } from '@/features/cv-manager/generate/cvGeneratorStore';
import { generateAndSharePdf } from '@/utils/cvPdfGenerator';

export default function CvPreviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const [sharing, setSharing] = useState(false);

  const data = cvGeneratorStore.getOrEmpty();

  const contact = [data.email, data.phone].map((v) => v.trim()).filter(Boolean).join('  ·  ');
  const experiences = data.experiences.filter((e) => e.jobTitle.trim() || e.company.trim());
  const skills = data.skills.filter((s) => s.trim());

  const handleShare = async () => {
    try {
      setSharing(true);
      await generateAndSharePdf(data);
    } catch {
      toast.show({
        type: 'error',
        title: 'Impossible de générer le PDF',
        message: 'Réessaie dans un instant.',
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Aperçu du CV" contentStyle={styles.content}>
      <View
        style={[
          styles.sheet,
          theme.shadows.md,
          { backgroundColor: '#FFFFFF', borderRadius: theme.radius.lg },
        ]}
      >
        <View style={styles.sheetHeader}>
          <Text variant="h2" color="#0f172a">
            {data.fullName.trim() || 'Ton nom'}
          </Text>
          {data.headline.trim().length > 0 && (
            <Text variant="label" color="#2563EB">
              {data.headline}
            </Text>
          )}
          {contact.length > 0 && (
            <Text variant="caption" color="#555555">
              {contact}
            </Text>
          )}
        </View>

        {data.summary.trim().length > 0 && (
          <PreviewSection label="Profil">
            <Text variant="bodySmall" color="#444444">
              {data.summary}
            </Text>
          </PreviewSection>
        )}

        {experiences.length > 0 && (
          <PreviewSection label="Expériences">
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHead}>
                  <Text variant="label" color="#0f172a" style={styles.itemTitle}>
                    {[exp.jobTitle, exp.company].filter(Boolean).join(' — ')}
                  </Text>
                  {exp.duration.trim().length > 0 && (
                    <Text variant="caption" color="#777777">
                      {exp.duration}
                    </Text>
                  )}
                </View>
                {exp.description?.trim() ? (
                  <Text variant="bodySmall" color="#444444">
                    {exp.description}
                  </Text>
                ) : null}
              </View>
            ))}
          </PreviewSection>
        )}

        {data.education.length > 0 && (
          <PreviewSection label="Formation">
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHead}>
                  <Text variant="label" color="#0f172a" style={styles.itemTitle}>
                    {[edu.degree, edu.school].filter(Boolean).join(' — ')}
                  </Text>
                  {edu.year.trim().length > 0 && (
                    <Text variant="caption" color="#777777">
                      {edu.year}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </PreviewSection>
        )}

        {skills.length > 0 && (
          <PreviewSection label="Compétences">
            <View style={styles.chips}>
              {skills.map((skill) => (
                <View key={skill} style={styles.chip}>
                  <Text variant="caption" color="#2563EB">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </PreviewSection>
        )}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Télécharger / Partager le PDF"
          onPress={handleShare}
          loading={sharing}
          fullWidth
          size="lg"
          leftIcon={<Icon name="share-outline" size="sm" color={theme.colors.text.primary} />}
        />
        <OutlineButton label="Modifier" onPress={() => router.back()} fullWidth />
      </View>
    </ScreenContainer>
  );
}

function PreviewSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="caption" color="#2563EB" style={styles.sectionLabel}>
        {label.toUpperCase()}
      </Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  sheet: {
    padding: 24,
    gap: 16,
  },
  sheetHeader: {
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    paddingBottom: 12,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 2,
  },
  item: {
    gap: 3,
    marginBottom: 8,
  },
  itemHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  itemTitle: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
