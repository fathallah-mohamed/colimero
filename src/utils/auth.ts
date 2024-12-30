import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const authenticateUser = async (email: string, password: string) => {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (signInError) {
      console.error("Erreur d'authentification:", signInError);
      throw signInError;
    }

    if (!signInData.user) {
      throw new Error("Aucune donnée utilisateur reçue");
    }

    console.log("Connexion réussie, données utilisateur:", signInData.user);
    
    const userType = signInData.user.user_metadata?.user_type;
    console.log("Type d'utilisateur:", userType);
    
    switch (userType) {
      case 'admin':
        return { success: true, redirectTo: "/admin" };
      case 'carrier':
        return { success: true, redirectTo: "/mes-tournees" };
      default:
        return { success: true, redirectTo: "/" };
    }
  } catch (error: any) {
    console.error("Erreur complète:", error);
    let errorMessage = "Une erreur est survenue lors de la connexion";
    
    if (error.message === "Invalid login credentials") {
      errorMessage = "Email ou mot de passe incorrect";
    } else if (error.message === "Email not confirmed") {
      errorMessage = "Veuillez confirmer votre email avant de vous connecter";
    }

    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: errorMessage,
    });

    return { success: false };
  }
};

export const handleLogout = async () => {
  try {
    // First, check if there's a valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // If no session exists, consider it a successful logout
      return { success: true };
    }

    // Clear local storage first to prevent token issues
    localStorage.removeItem('supabase.auth.token');
    
    // Attempt to sign out with local scope to avoid cross-tab issues
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    
    if (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erreur complète:", error);
    return { success: false, error };
  }
};

export const checkAuthStatus = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { isAuthenticated: false };
    }

    // Verify if the session is still valid
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      // If there's an error or no user, clear the invalid session
      await supabase.auth.signOut({ scope: 'local' });
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isAuthenticated: false };
  }
};