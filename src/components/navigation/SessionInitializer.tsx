import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSessionInitializer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          if (event === 'SIGNED_IN') {
            if (newSession?.user?.user_metadata?.user_type === 'client') {
              const { data: client, error: clientError } = await supabase
                .from('clients')
                .select('email_verified')
                .eq('id', newSession.user.id)
                .maybeSingle();

              if (clientError && clientError.code !== 'PGRST116') {
                console.error("Error fetching client:", clientError);
                return;
              }

              if (client && !client?.email_verified) {
                toast({
                  variant: "destructive",
                  title: "Compte non activé",
                  description: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter.",
                });
                await supabase.auth.signOut();
                return;
              }
            }

            if (sessionStorage.getItem('returnPath')) {
              const returnPath = sessionStorage.getItem('returnPath');
              sessionStorage.removeItem('returnPath');
              navigate(returnPath || '/');
            }
          } else if (event === 'SIGNED_OUT') {
            if (location.pathname.includes('/reserver/')) {
              navigate('/');
            }
          }
        });

        if (!session) {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError && refreshError.message !== 'Auth session missing!') {
            console.error("Session refresh error:", refreshError);
          } else if (refreshData.session) {
            console.log('Session refreshed successfully');
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        if (error.message !== 'Auth session missing!' && error.code !== 'PGRST116') {
          console.error("Session initialization error:", error);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, [location.pathname, navigate, toast]);
}