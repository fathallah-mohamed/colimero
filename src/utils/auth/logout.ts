import { supabase } from "@/integrations/supabase/client";

export const handleLogoutFlow = async () => {
  try {
    // Récupérer la session actuelle
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: true }; // Déjà déconnecté
    }

    // Effectuer la déconnexion
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return { 
        success: false, 
        error: "Une erreur est survenue lors de la déconnexion" 
      };
    }

    // Vérifier que la déconnexion a bien eu lieu
    const { data: { session: checkSession } } = await supabase.auth.getSession();
    
    if (checkSession) {
      console.error("La session existe toujours après la déconnexion");
      return { 
        success: false, 
        error: "La déconnexion n'a pas pu être effectuée" 
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