import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    // Clear any potentially stale session data
    const currentSession = await supabase.auth.getSession();
    
    if (!currentSession.data.session) {
      return { isAuthenticated: false };
    }

    // Verify the user is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("User verification error:", userError);
      // Clear the invalid session
      await supabase.auth.signOut({ scope: 'local' });
      return { isAuthenticated: false, error: userError };
    }

    if (!user) {
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth check error:", error);
    // Clear any potentially corrupted session state
    await supabase.auth.signOut({ scope: 'local' });
    return { isAuthenticated: false, error };
  }
};

// Create a custom hook for auth redirect
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return async () => {
    const { isAuthenticated, error } = await checkAuthStatus();

    if (!isAuthenticated) {
      if (error) {
        console.error("Auth error:", error);
      }
      
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      
      navigate("/connexion");
    }
  };
};