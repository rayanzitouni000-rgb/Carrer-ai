import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import {
  OutlineButton,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
  useToast,
} from '@/design-system';
import { useCoverLetterGenerator } from '@/hooks/useCoverLetterGenerator';
import { generateAndShareCoverLetterPdf } from '@/utils/coverLetterPdfGenerator';

function PreviewSection({ label, children }: { label: string; children: string }) {
  const theme = useTheme();

  if (!children.trim()) return null;

  return (
    <View style={styles.section}>
      <Text variant="label" color={theme.colors.brand.primaryLight}>
        {label}
      </Text>
      <Text variant="bodySmall" color="#444444">
        {children}
      </Text>
    </View>
  );
}

export default function CoverLetterPreviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { data } = useCoverLetterGenerator();
  const [sharing, setSharing] = useState(false);

  const letterDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = async () => {
    try {
      setSharing(true);
      await generateAndShareCoverLetterPdf(data);
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
    <ScreenContainer scrollable safeAreaBottom showBack title="Aperçu de la lettre" contentStyle={styles.content}>
      <View
        style={[
          styles.sheet,
          theme.shadows.md,
          { backgroundColor: '#FFFFFF', borderRadius: theme.radius.lg },
        ]}
      >
        <View style={styles.sheetHeader}>
          <Text variant="h3" color="#0f172a">
            {data.fullName.trim() || 'Ton nom'}
          </Text>
          <Text variant="caption" color="#777777">
            {letterDate}
          </Text>
        </View>

        <PreviewSection label="Destinataire">{data.company}</PreviewSection>

        <View style={styles.section}>
          <Text variant="label" color="#2563EB">
            Objet
          </Text>
          <Text variant="bodySmall" color="#444444">
            Candidature — {data.jobTitle}
          </Text>
        </View>

        <PreviewSection label="Introduction">{data.introText}</PreviewSection>
        <PreviewSection label="Motivation">{data.motivationText}</PreviewSection>
        <PreviewSection label="Clôture">{data.closingText}</PreviewSection>

        <Text variant="label" color="#0f172a" style={styles.signature}>
          {data.fullName.trim() || 'Ton nom'}
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Télécharger / Partager le PDF"
          fullWidth
          loading={sharing}
          onPress={() => void handleShare()}
        />
        <OutlineButton
          label="Modifier"
          fullWidth
          onPress={() => router.push('/cover-letter/template' as Href)}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  sheet: {
    padding: 20,
    gap: 14,
  },
  sheetHeader: {
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
  },
  section: { gap: 6 },
  signature: { marginTop: 8 },
  actions: { gap: 10 },
});
