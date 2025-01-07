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
      flowType: 'pkce'
    }
  }
);