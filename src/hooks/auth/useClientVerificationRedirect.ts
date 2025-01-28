import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useClientVerificationRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkClientStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No session found");
          return;
        }

        const userType = session.user.user_metadata?.user_type;
        console.log("Checking user type:", userType);

        if (userType === 'client') {
          console.log("Checking client verification status");
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('email_verified, status')
            .eq('id', session.user.id)
            .single();

          if (clientError) {
            console.error("Error checking client status:", clientError);
            return;
          }

          console.log("Client verification data:", clientData);

          if (!clientData?.email_verified || clientData?.status !== 'active') {
            console.log("Account needs verification, redirecting to activation");
            if (location.pathname !== '/activation-compte') {
              await supabase.auth.signOut();
              navigate('/activation-compte', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error("Error in checkClientStatus:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de votre compte."
        });
      }
    };

    checkClientStatus();
  }, [navigate, location.pathname, toast]);
}