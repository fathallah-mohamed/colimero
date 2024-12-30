import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // First check if we have a session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If there's no session, consider it a successful logout
    if (!session) {
      return { success: true };
    }

    // Attempt to sign out
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error("Logout error:", signOutError);
      return { success: false, error: signOutError };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error };
  }
};