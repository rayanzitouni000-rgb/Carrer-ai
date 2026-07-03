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
import { authService } from '@/services/authService';

export function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = careerProfileStore.get();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await authService.register({
      email,
      password,
      firstName: profile.firstName,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
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
        Ton profil et ton compte sont enregistrés localement sur cet appareil.
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
