import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiCharacterAvatar, AiSpeechBubble } from '@/components/aiCharacter';
import {
  Input,
  OutlineButton,
  PressableScale,
  PrimaryButton,
  Text,
  useTheme,
} from '@/design-system';
import { useJobSearchPreferences } from '@/hooks/useJobSearchPreferences';
import { RADIUS_OPTIONS } from '@/types/jobMatch';

export default function JobMatchLocationSetupScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setLocation, skipLocationSetup } = useJobSearchPreferences();

  const [city, setCity] = useState('');
  const [radius, setRadius] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidate = async () => {
    const trimmed = city.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await setLocation(trimmed, trimmed, radius);
      router.replace('/(tabs)/job-match');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await skipLocationSetup();
      router.replace('/(tabs)/job-match');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: theme.spacing['4'],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AiCharacterAvatar state="idle" size="medium" />
          <AiSpeechBubble message="Où cherches-tu du travail ?" />
        </View>

        <Input
          label="Ville ou code postal"
          placeholder="Ex : Paris, Lyon, 75001..."
          value={city}
          onChangeText={setCity}
          leftIcon="location-outline"
          autoCapitalize="words"
          returnKeyType="done"
        />

        <View style={styles.section}>
          <Text variant="label" color={theme.colors.text.secondary}>
            Rayon de recherche
          </Text>
          <View style={styles.chips}>
            {RADIUS_OPTIONS.map((option) => {
              const selected = radius === option.value;
              return (
                <PressableScale
                  key={option.value}
                  scale={0.96}
                  onPress={() => setRadius(option.value)}
                >
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
                      {option.label}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <PrimaryButton
          label="Valider"
          fullWidth
          disabled={!city.trim() || isSubmitting}
          onPress={() => void handleValidate()}
        />

        <OutlineButton
          label="Passer"
          fullWidth
          disabled={isSubmitting}
          onPress={() => void handleSkip()}
        />

        <Text variant="caption" color={theme.colors.text.muted} align="center">
          Passer lance une recherche nationale sans filtre géographique.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 24 },
  hero: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  section: { gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
