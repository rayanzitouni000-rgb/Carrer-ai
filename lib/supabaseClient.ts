import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY manquant dans .env'
  );
}

/** SSR web export EAS uniquement — pas sur iOS/Android. */
const isWebSSR = Platform.OS === 'web' && typeof window === 'undefined';

const authStorage = isWebSSR
  ? {
      getItem: async () => null,
      setItem: async () => undefined,
      removeItem: async () => undefined,
    }
  : AsyncStorage;

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    storage: authStorage,
    autoRefreshToken: !isWebSSR,
    persistSession: !isWebSSR,
    detectSessionInUrl: false,
  },
});
