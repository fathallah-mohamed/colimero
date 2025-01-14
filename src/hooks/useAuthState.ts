import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message.includes('refresh_token_not_found')) {
            await handleSessionError();
          }
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN') {
            console.log('User signed in:', session?.user?.email);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            handleSignOut();
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Session token refreshed');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Session initialization error:", error);
        handleSessionError();
      }
    };

    const handleSessionError = async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      if (mounted.current) {
        toast({
          variant: "destructive",
          title: "Session expirée",
          description: "Veuillez vous reconnecter.",
        });
        navigate('/');
      }
    };

    const handleSignOut = () => {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('returnPath');
      navigate('/');
    };

    initSession();

    return () => {
      mounted.current = false;
    };
  }, [navigate, toast]);
}