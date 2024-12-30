import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Try to get the current session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error during logout:", sessionError);
      // Consider it a successful logout if we can't get the session
      return { success: true };
    }

    if (!session) {
      // No active session, consider it a successful logout
      return { success: true };
    }

    // We have a valid session, proceed with logout
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });

    if (error) {
      console.error("Logout error:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la déconnexion" 
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    return { 
      success: false, 
      error: "Une erreur inattendue est survenue" 
    };
  }
};