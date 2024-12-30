import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First ensure we clear any existing session
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    // Even if there's an error, try to clean up
    localStorage.removeItem('supabase.auth.token');
    return { 
      success: true // Consider it successful since we cleaned up
    };
  }
};