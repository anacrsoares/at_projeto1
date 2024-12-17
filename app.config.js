import "dotenv/config";

export default {
  expo: {
    name: "FinancialManagerApp",
    slug: "financial-manager-app",
    version: "1.0.0",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
