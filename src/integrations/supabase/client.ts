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
      debug: true
    },
    global: {
      fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
        const defaultOptions: RequestInit = {
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        };

        const mergedOptions = {
          ...defaultOptions,
          ...options,
          headers: {
            ...defaultOptions.headers,
            ...options.headers
          }
        };

        return fetch(url, mergedOptions)
          .then(response => {
            if (!response.ok) {
              console.error('Fetch error:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url
              });
            }
            return response;
          })
          .catch(error => {
            console.error('Network error:', error);
            throw error;
          });
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

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});