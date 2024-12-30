import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    if (!session) {
      return { isAuthenticated: false };
    }

    // Verify the session is still valid by attempting to get user
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // Session is invalid, clear it
      await supabase.auth.signOut();
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