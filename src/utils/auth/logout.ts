import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Déconnexion simple sans spécifier de scope
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur de déconnexion:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la déconnexion" 
      };
    }

    // Si pas d'erreur, la déconnexion est réussie
    return { success: true };
  } catch (error) {
    console.error("Erreur inattendue lors de la déconnexion:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la déconnexion" 
    };
  }
};