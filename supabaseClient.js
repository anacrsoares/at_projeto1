import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Erro: Variáveis de ambiente não foram carregadas corretamente."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
