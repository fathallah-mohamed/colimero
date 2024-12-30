import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AuthResponse {
  success: boolean;
  redirectTo?: string;
}

export const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
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
    
    // Vérifier si l'utilisateur est un admin
    const { data: adminData, error: adminError } = await supabase
      .from('administrators')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    console.log("Résultat de la vérification admin:", { adminData, adminError });

    if (adminData) {
      console.log("Utilisateur admin trouvé:", adminData);
      return { success: true, redirectTo: "/admin" };
    }

    // Si ce n'est pas un admin, vérifier le type d'utilisateur normal
    const userType = signInData.user.user_metadata?.user_type;
    console.log("Type d'utilisateur:", userType);
    
    switch (userType) {
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