import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session check error:", sessionError);
      // If we can't get the session, clear local storage and consider it a successful logout
      localStorage.removeItem('supabase.auth.token');
      return { success: true };
    }

    if (!session) {
      // No active session, consider it a successful logout
      return { success: true };
    }

    // We have a valid session, proceed with logout
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Only clear the current tab's session
    });

    if (error) {
      console.error("Logout error:", error);
      // If we get a 403/session not found, still consider it a successful logout
      if (error.status === 403 && error.message.includes('session_not_found')) {
        localStorage.removeItem('supabase.auth.token');
        return { success: true };
      }
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