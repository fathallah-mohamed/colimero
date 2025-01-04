import { supabase } from "@/integrations/supabase/client";

interface LogoutResult {
  success: boolean;
  error?: string;
}

export const handleLogoutFlow = async (): Promise<LogoutResult> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    // Clear any local storage items related to auth
    localStorage.removeItem('colimero-auth');
    
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message || "Une erreur est survenue lors de la déconnexion"
    };
  }
};