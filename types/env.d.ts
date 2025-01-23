declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      DEEPSEEK_API_KEY: string;
      NODE_ENV: 'development' | 'production';
    }
  }