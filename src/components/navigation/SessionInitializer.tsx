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
    let authSubscription: any = null;

    const initSession = async () => {
      try {
        // Récupérer la session initiale
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        // Configurer l'écouteur de changements d'état d'authentification
        authSubscription = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log("Auth state change:", event);

          if (event === 'SIGNED_IN') {
            if (newSession?.user?.user_metadata?.user_type === 'client') {
              const { data: client } = await supabase
                .from('clients')
                .select('email_verified')
                .eq('id', newSession.user.id)
                .maybeSingle();

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

            const returnPath = sessionStorage.getItem('returnPath');
            if (returnPath) {
              sessionStorage.removeItem('returnPath');
              navigate(returnPath);
            }
          } else if (event === 'SIGNED_OUT') {
            if (location.pathname.includes('/reserver/')) {
              navigate('/');
            }
          }
        });

        // Si pas de session, essayer de rafraîchir
        if (!session) {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError && refreshError.message !== 'Auth session missing!') {
            console.error("Session refresh error:", refreshError);
          }
        }

      } catch (error: any) {
        if (error.message !== 'Auth session missing!' && error.code !== 'PGRST116') {
          console.error("Session initialization error:", error);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [location.pathname, navigate, toast]);
}