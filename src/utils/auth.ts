import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AuthResponse {
  success: boolean;
  redirectTo?: string;
}

export const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Vérifier d'abord si l'utilisateur est un transporteur en attente
    const { data: registrationRequest } = await supabase
      .from('carrier_registration_requests')
      .select('status')
      .eq('email', email.trim())
      .maybeSingle();

    if (registrationRequest) {
      if (registrationRequest.status === 'pending') {
        toast({
          variant: "destructive",
          title: "Compte en attente de validation",
          description: "Votre demande d'inscription est en cours d'examen par notre équipe.",
        });
        return { success: false };
      } else if (registrationRequest.status === 'rejected') {
        toast({
          variant: "destructive",
          title: "Compte rejeté",
          description: "Votre demande d'inscription a été rejetée. Veuillez nous contacter pour plus d'informations.",
        });
        return { success: false };
      }
    }

    // Procéder à la connexion si le compte est approuvé ou si ce n'est pas un transporteur
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (signInError) {
      console.error("Erreur d'authentification:", signInError);
      
      if (signInError.message === "Invalid login credentials") {
        toast({
          variant: "destructive",
          title: "Identifiants incorrects",
          description: "Veuillez vérifier votre email et mot de passe.",
        });
      } else if (signInError.message === "Email not confirmed") {
        toast({
          variant: "destructive",
          title: "Email non confirmé",
          description: "Veuillez confirmer votre email avant de vous connecter.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion.",
        });
      }
      return { success: false };
    }

    if (!signInData.user) {
      throw new Error("Aucune donnée utilisateur reçue");
    }

    console.log("Connexion réussie, données utilisateur:", signInData.user);
    
    // Vérifier si l'utilisateur est un admin
    const { data: adminData } = await supabase
      .from('administrators')
      .select('*')
      .eq('id', signInData.user.id)
      .maybeSingle();

    if (adminData) {
      return { success: true, redirectTo: "/admin" };
    }

    // Si ce n'est pas un admin, vérifier le type d'utilisateur normal
    const userType = signInData.user.user_metadata?.user_type;
    
    switch (userType) {
      case 'carrier':
        return { success: true, redirectTo: "/mes-tournees" };
      case 'client':
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          return { success: true, redirectTo: returnPath };
        }
        return { success: true, redirectTo: "/" };
      default:
        return { success: true, redirectTo: "/" };
    }
  } catch (error: any) {
    console.error("Erreur complète:", error);
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: "Une erreur est survenue lors de la connexion.",
    });
    return { success: false };
  }
};