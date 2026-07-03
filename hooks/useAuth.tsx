import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '@/lib/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<UseAuthReturn | null>(null);

function mapSupabaseUser(user: { id: string; email?: string | null } | null): AuthUser | null {
  if (!user) return null;
  return { id: user.id, email: user.email ?? '' };
}

export function translateAuthError(message: string): string {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
    return 'Un compte existe déjà avec cet email.';
  }
  if (
    normalized.includes('password should be at least') ||
    normalized.includes('password is too short')
  ) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (normalized.includes('unable to validate email address') || normalized.includes('invalid email')) {
    return 'Veuillez saisir une adresse email valide.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Confirme ton adresse email avant de te connecter.';
  }
  if (normalized.includes('signup is disabled')) {
    return "L'inscription est temporairement désactivée.";
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'Problème de connexion. Vérifie ton réseau et réessaie.';
  }

  return message || 'Une erreur est survenue. Réessaie.';
}

export async function getAuthUserFromSession(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession();
  return mapSupabaseUser(data.session?.user ?? null);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      return { error: translateAuthError(error.message) };
    }

    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      return { error: translateAuthError(error.message) };
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<UseAuthReturn>(
    () => ({ user, isLoading, signUp, signIn, signOut }),
    [user, isLoading, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  }
  return context;
}
