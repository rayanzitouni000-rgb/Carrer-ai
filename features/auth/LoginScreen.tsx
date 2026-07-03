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
import { useAuth } from '@/hooks/useAuth';

export function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable safeAreaBottom>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.text.primary}>
          Bon retour
        </Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          Connecte-toi pour poursuivre ton parcours avec CareerPilot.
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
          placeholder="Ton mot de passe"
          secureTextEntry
          leftIcon="lock-closed-outline"
        />

        {error && (
          <Text variant="caption" color={theme.colors.status.danger}>
            {error}
          </Text>
        )}

        <PrimaryButton
          label="Se connecter"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim() || !password.trim()}
          fullWidth
          size="lg"
        />
      </Card>

      <OutlineButton
        label="Créer un compte"
        onPress={() => router.replace('/signup')}
        fullWidth
      />
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
