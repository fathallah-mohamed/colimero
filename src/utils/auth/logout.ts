import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Clear any stale tokens first
    localStorage.removeItem('supabase.auth.token');
    
    // Get current session state
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If there's no session or we get a session error, consider it a successful logout
    if (!session || sessionError) {
      return { success: true };
    }

    // Only attempt to sign out if we have a valid session
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'local' // Only clear the current tab's session
    });
    
    if (signOutError && signOutError.message !== "Session not found") {
      console.error("Logout error:", signOutError);
      return { success: false, error: signOutError };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, we want to clear local storage
    localStorage.removeItem('supabase.auth.token');
    return { success: false, error };
  }
};