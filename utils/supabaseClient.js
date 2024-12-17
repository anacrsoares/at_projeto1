import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Certifique-se de usar Constants.manifest.extra corretamente
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

// Verificação para garantir que as variáveis foram carregadas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Erro: Variáveis de ambiente não foram carregadas corretamente."
  );
}

// Inicialize o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
