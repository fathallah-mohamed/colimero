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
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "There was a problem connecting to the service. Please try again later."
          });
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          if (event === 'SIGNED_IN') {
            if (newSession?.user?.user_metadata?.user_type === 'client') {
              try {
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
              } catch (error) {
                console.error("Error checking client verification:", error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Une erreur est survenue lors de la vérification de votre compte."
                });
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
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError && refreshError.message !== 'Auth session missing!') {
              console.error("Session refresh error:", refreshError);
              toast({
                variant: "destructive",
                title: "Session Error",
                description: "Unable to refresh your session. Please try logging in again."
              });
            } else if (refreshData.session) {
              console.log('Session refreshed successfully');
            }
          } catch (error) {
            console.error("Session refresh error:", error);
            toast({
              variant: "destructive",
              title: "Session Error",
              description: "There was a problem refreshing your session. Please try logging in again."
            });
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        if (error.message !== 'Auth session missing!' && error.code !== 'PGRST116') {
          console.error("Session initialization error:", error);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Unable to establish connection. Please check your internet connection and try again."
          });
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, [location.pathname, navigate, toast]);
}