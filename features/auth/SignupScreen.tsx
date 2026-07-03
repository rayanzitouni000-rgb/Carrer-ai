import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  Card,
  Input,
  OutlineButton,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
} from '@/design-system';
import { careerProfileStore } from '@/services/careerProfileStore';
import { useOnboardingAssessment } from '@/hooks/useOnboardingAssessment';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

export function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signUp } = useAuth();
  const { shouldOfferAssessmentAfterWizard } = useOnboardingAssessment();
  const profile = careerProfileStore.get();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError('Compte créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.');
      return;
    }

    const firstName = profile.firstName.trim();
    if (firstName) {
      careerProfileStore.update({ firstName });
    }

    const offerAssessment = await shouldOfferAssessmentAfterWizard();
    if (offerAssessment) {
      router.replace('/(tabs)/interview-simulator/onboarding-assessment');
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable safeAreaBottom>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          Créer un compte
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Enregistre ton profil et accède à CareerPilot où que tu sois.
        </Text>
      </View>

      <Card variant="elevated" padding="5" style={styles.card}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="toi@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="Au moins 6 caractères"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />
        <Input
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Répète ton mot de passe"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />

        {error && (
          <Text variant="caption" color={theme.colors.status.danger}>
            {error}
          </Text>
        )}

        <PrimaryButton
          label="Créer un compte"
          onPress={handleSignup}
          loading={loading}
          disabled={!email.trim() || !password.trim() || !confirmPassword.trim()}
          fullWidth
          size="lg"
        />
      </Card>

      <OutlineButton
        label="Déjà un compte ? Se connecter"
        onPress={() => router.replace('/login')}
        fullWidth
      />

      <Text variant="caption" color={theme.colors.text.muted} align="center">
        Ton compte est sécurisé via Supabase. Tes données restent sur cet appareil en attendant la synchronisation cloud.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  card: {
    gap: 16,
    marginBottom: 16,
  },
});
