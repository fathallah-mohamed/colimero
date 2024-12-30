import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No active session, consider it a successful logout
      return { success: true };
    }

    // Proceed with logout
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Only clear the current tab's session
    });

    if (error) {
      console.error("Erreur de déconnexion:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la déconnexion" 
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur inattendue lors de la déconnexion:", error);
    return { 
      success: false, 
      error: "Une erreur inattendue est survenue" 
    };
  }
};