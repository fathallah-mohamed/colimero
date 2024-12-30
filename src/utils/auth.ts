import { supabase } from "@/integrations/supabase/client";

export const checkAuthStatus = async () => {
  try {
    // Clear any stale token first
    localStorage.removeItem('supabase.auth.token');
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { isAuthenticated: false, error: sessionError };
    }

    if (!session) {
      return { isAuthenticated: false };
    }

    // Verify the user is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("User verification error:", userError);
      return { isAuthenticated: false, error: userError };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth check error:", error);
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