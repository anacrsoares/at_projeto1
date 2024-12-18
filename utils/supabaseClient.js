import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Certifique-se de usar Constants.manifest.extra corretamente
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Verificação para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Erro: Variáveis de ambiente não foram carregadas corretamente."
  );
}

// Inicialize o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  localStorage: AsyncStorage,
});
