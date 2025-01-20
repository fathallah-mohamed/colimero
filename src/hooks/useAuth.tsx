import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  userType?: string | null;
  user?: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        isAuthenticated: !!session,
        userType: session?.user?.user_metadata?.user_type,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        isAuthenticated: !!session,
        userType: session?.user?.user_metadata?.user_type,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}