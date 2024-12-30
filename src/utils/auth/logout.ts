import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if there's an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If there's no session, consider it a successful logout
    if (!session) {
      localStorage.removeItem('supabase.auth.token');
      return { success: true };
    }

    // Attempt to sign out
    const { error } = await supabase.auth.signOut();
    
    // Always clear local storage
    localStorage.removeItem('supabase.auth.token');
    
    // If we get a session error, we still consider it a successful logout
    // since the user will be effectively logged out
    if (error && error.message !== "Session not found") {
      console.error("Logout error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local storage even if there's an error
    localStorage.removeItem('supabase.auth.token');
    return { success: false, error };
  }
};