import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    // First, get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { isAuthenticated: false };
    }

    // If we have a session, verify it's still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // If there's an error or no user, clear the invalid session
      await supabase.auth.signOut({ scope: 'local' });
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user };
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
      // Clear any existing session data
      await supabase.auth.signOut({ scope: 'local' });
      
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      navigate("/connexion");
    }

    if (error) {
      console.error("Auth error:", error);
    }
  };

  return checkAndRedirect;
};