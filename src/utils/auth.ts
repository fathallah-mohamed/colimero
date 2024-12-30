import { supabase } from "@/integrations/supabase/client";

export const checkAuthStatus = async () => {
  try {
    // First clear any potentially invalid session data
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      return { isAuthenticated: false, error: sessionError };
    }

    if (!session) {
      return { isAuthenticated: false };
    }

    // Double check the user is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("User verification error:", userError);
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      return { isAuthenticated: false, error: userError };
    }

    if (!user) {
      await supabase.auth.signOut();
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Error checking auth status:", error);
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
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
        await supabase.auth.signOut();
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