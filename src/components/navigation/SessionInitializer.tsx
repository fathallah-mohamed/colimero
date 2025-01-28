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
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const initSession = async () => {
      try {
        const localSession = localStorage.getItem('supabase.auth.token');
        if (!localSession) {
          console.log('No local session found');
          return;
        }

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
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log("Auth state change:", event);

          try {
            if (event === 'SIGNED_IN') {
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

        return () => {
          mounted = false;
          if (subscription) subscription.unsubscribe();
        };

      } catch (error: any) {
        console.error("Session initialization error:", error);
        if (!error.message.includes('Auth session missing')) {
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Une erreur est survenue lors de l'initialisation de votre session.",
          });
        }
      }
    };

    initSession();
  }, [location.pathname, navigate, toast]);
}