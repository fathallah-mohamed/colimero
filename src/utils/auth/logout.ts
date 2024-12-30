import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First try to get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { success: true }; // Return success since user is effectively logged out
    }

    if (!session) {
      return { success: true }; // No session means user is already logged out
    }

    // If we have a session, attempt to sign out without specifying scope
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("SignOut error:", signOutError);
      // If it's a session error, consider it a success since user is effectively logged out
      if (signOutError.message.includes('session')) {
        return { success: true };
      }
      throw signOutError;
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