import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if we have a session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No session means user is already logged out
      return { success: true };
    }

    // Try to sign out without scope first (simpler approach)
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("SignOut error:", error);
      // If it's a session error, consider it a success since user is effectively logged out
      if (error.message.includes('session')) {
        return { success: true };
      }
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de la déconnexion" 
      };
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