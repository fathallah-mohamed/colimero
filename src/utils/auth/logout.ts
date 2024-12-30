import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Simple signOut call without any scope parameter
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur de déconnexion:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la déconnexion" 
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur inattendue lors de la déconnexion:", error);
    return { 
      success: false, 
      error: "Une erreur inattendue est survenue" 
    };
  }
};