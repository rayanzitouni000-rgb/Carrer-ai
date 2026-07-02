import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Input, PressableScale, PrimaryButton, Text, useTheme } from '@/design-system';
import { useRealInterviews } from '@/hooks/useRealInterviews';

export default function AddInterviewScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addInterview } = useRealInterviews();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const canSave = company.trim().length > 0 && jobTitle.trim().length > 0;

  const handleSave = async () => {
    await addInterview({ company: company.trim(), jobTitle: jobTitle.trim() });
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: theme.spacing['4'],
          gap: 20,
        }}
      >
        <View style={styles.headerRow}>
          <PressableScale scale={0.92} onPress={() => router.back()}>
            <View style={[styles.backBtn, { backgroundColor: theme.colors.card.default, borderRadius: theme.radius.full }]}>
              <Icon name="chevron-back" size="sm" color={theme.colors.text.primary} />
            </View>
          </PressableScale>
          <Text variant="h2" color={theme.colors.text.primary}>
            Ajouter un entretien
          </Text>
          <View style={styles.backBtn} />
        </View>

        <Input label="Entreprise" placeholder="Ex: Doctolib" value={company} onChangeText={setCompany} />
        <Input label="Poste" placeholder="Ex: Product Designer" value={jobTitle} onChangeText={setJobTitle} />

        <PrimaryButton label="Enregistrer" fullWidth disabled={!canSave} onPress={() => void handleSave()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
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
});
