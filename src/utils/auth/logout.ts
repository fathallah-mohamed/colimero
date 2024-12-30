import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Get current session state
    const { data: { session } } = await supabase.auth.getSession();
    
    // If there's no session, consider it a successful logout
    if (!session) {
      return { success: true };
    }

    // Only attempt to sign out if we have a valid session
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'local' // Only clear the current tab's session
    });
    
    if (signOutError) {
      console.error("Logout error:", signOutError);
      // Even if there's an error, clear local storage
      localStorage.removeItem('supabase.auth.token');
      return { success: false, error: signOutError };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, clear local storage
    localStorage.removeItem('supabase.auth.token');
    return { success: false, error };
  }
};