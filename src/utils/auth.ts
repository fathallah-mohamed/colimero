import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const checkAuthStatus = async () => {
  try {
    // First check if there's a valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No session found, user is not authenticated
      return { isAuthenticated: false };
    }

    // If we have a session, verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("User verification error:", userError);
      // Clear the invalid session
      await supabase.auth.signOut();
      return { isAuthenticated: false, error: userError };
    }

    if (!user) {
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth check error:", error);
    // Clear any potentially corrupted session state
    await supabase.auth.signOut();
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