import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dsmahpgrhjoikcxuiqrw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbWFocGdyaGpvaWtjeHVpcXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MDI3MTAsImV4cCI6MjA1MDQ3ODcxMH0.rfIrkVdj1ADr4GUqowlDu4_sL0akMl1F9FH93mZHMe4";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce',
      debug: true // Activé pour le débogage
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    }
  }
);

// Add debug logging for initialization
console.log('Supabase client initialized with URL:', SUPABASE_URL);

// Add session check on init
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error checking initial session:', error);
  } else {
    console.log('Initial session check:', data.session ? 'Session found' : 'No session');
  }
});