import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if there's an active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If there's no session or we get a session error, consider it a successful logout
    // since the user will effectively be logged out
    if (!session || sessionError) {
      // Clear any stale data
      localStorage.removeItem('supabase.auth.token');
      return { success: true };
    }

    // If we have a valid session, attempt to sign out
    const { error: signOutError } = await supabase.auth.signOut();
    
    // Always clear local storage
    localStorage.removeItem('supabase.auth.token');
    
    if (signOutError && signOutError.message !== "Session not found") {
      console.error("Logout error:", signOutError);
      return { success: false, error: signOutError };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local storage even if there's an error
    localStorage.removeItem('supabase.auth.token');
    return { success: false, error };
  }
};