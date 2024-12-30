import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { isAuthenticated: false, error: sessionError };
    }

    if (!session) {
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user: session.user };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isAuthenticated: false, error };
  }
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAndRedirect = async () => {
    const { isAuthenticated, error } = await checkAuthStatus();

    if (!isAuthenticated) {
      if (error) {
        console.error("Auth error:", error);
      }
      
      // Try to sign out locally to clear any invalid session data
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
      }

      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      
      navigate("/connexion");
    }
  };

  return checkAndRedirect;
};