import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY manquant dans .env'
  );
}

/** Évite l'accès AsyncStorage/window pendant l'export statique web (EAS Update). */
const authStorage =
  typeof window === 'undefined'
    ? {
        getItem: async () => null,
        setItem: async () => undefined,
        removeItem: async () => undefined,
      }
    : AsyncStorage;

let client: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
    auth: {
      storage: authStorage,
      autoRefreshToken: typeof window !== 'undefined',
      persistSession: typeof window !== 'undefined',
      detectSessionInUrl: false,
    },
  });
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!client) {
      client = createSupabaseClient();
    }
    return Reflect.get(client, prop, receiver);
  },
});
