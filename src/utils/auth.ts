import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    // Clear any potentially invalid session data first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      localStorage.removeItem('supabase.auth.token');
      return { isAuthenticated: false, error: sessionError };
    }

    if (!session) {
      return { isAuthenticated: false };
    }

    // Verify the session is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("User verification error:", userError);
      if (userError.status === 403) {
        localStorage.removeItem('supabase.auth.token');
      }
      return { isAuthenticated: false, error: userError };
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
      if (error) {
        console.error("Auth error:", error);
        // Clear any invalid session data
        localStorage.removeItem('supabase.auth.token');
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