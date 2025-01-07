import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if we have a session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No session means user is already logged out
      return { success: true };
    }

    // Sign out with specific scope
    const { error } = await supabase.auth.signOut({
      scope: 'local'  // Changed from 'global' to 'local' to avoid session issues
    });

    if (error) {
      console.error("SignOut error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la déconnexion" 
    };
  }
};