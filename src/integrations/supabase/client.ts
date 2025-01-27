import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dsmahpgrhjoikcxuiqrw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbWFocGdyaGpvaWtjeHVpcXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MDI3MTAsImV4cCI6MjA1MDQ3ODcxMH0.rfIrkVdj1ADr4GUqowlDu4_sL0akMl1F9FH93mZHMe4";

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window?.localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    }
  }
);