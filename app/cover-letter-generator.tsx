import { StyleSheet } from 'react-native';

import { Icon, ScreenContainer, Text, useTheme } from '@/design-system';

export default function CoverLetterGeneratorScreen() {
  const theme = useTheme();

  return (
    <ScreenContainer
      scrollable
      safeAreaBottom
      showBack
      title="Lettre de motivation"
      contentStyle={styles.content}
    >
      <Icon name="create-outline" size="xl" color={theme.colors.brand.primaryLight} />
      <Text variant="h3" color={theme.colors.text.primary} style={styles.title}>
        Bientôt disponible
      </Text>
      <Text variant="body" color={theme.colors.text.secondary} align="center" style={styles.body}>
        L'IA t'aidera bientôt à rédiger des lettres de motivation personnalisées pour chaque
        offre.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 48,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  body: {
    marginTop: 8,
    lineHeight: 24,
  },
});
