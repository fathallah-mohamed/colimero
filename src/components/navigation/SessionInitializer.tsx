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
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    const initSession = async () => {
      try {
        // Vérifier d'abord le stockage local pour la session
        const localSession = localStorage.getItem('supabase.auth.token');
        if (!localSession) {
          console.log('No local session found');
          return;
        }

        // Récupérer la session avec retry
        const getSessionWithRetry = async (): Promise<any> => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
          } catch (error) {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              console.log(`Retry attempt ${retryCount} for getSession`);
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              return getSessionWithRetry();
            }
            throw error;
          }
        };

        const session = await getSessionWithRetry();
        
        // Configurer l'écouteur avec gestion d'erreur
        authSubscription = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log("Auth state change:", event);

          try {
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
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
            }
          } catch (error: any) {
            console.error('Error in auth state change handler:', error);
            if (!error.message.includes('Auth session missing')) {
              toast({
                variant: "destructive",
                title: "Erreur d'authentification",
                description: "Une erreur est survenue lors de la mise à jour de votre session.",
              });
            }
          }
        });

        // Rafraîchir la session si nécessaire
        if (!session) {
          try {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError && !refreshError.message.includes('Auth session missing')) {
              console.error("Session refresh error:", refreshError);
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError);
          }
        }

      } catch (error: any) {
        if (!error.message.includes('Auth session missing') && error.code !== 'PGRST116') {
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