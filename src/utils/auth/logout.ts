import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    // Even if we get a session error, we want to clear local storage
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