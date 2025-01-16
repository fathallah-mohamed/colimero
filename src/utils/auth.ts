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
    
    // Vérifier si l'email est vérifié pour les clients
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientData && !clientData.email_verified) {
      toast({
        variant: "destructive",
        title: "Email non vérifié",
        description: "Veuillez vérifier votre email avant de vous connecter.",
      });
      // Déconnexion automatique si l'email n'est pas vérifié
      await supabase.auth.signOut();
      return { success: false };
    }

    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté",
    });

    // Vérifier si l'utilisateur est un admin
    const { data: adminData } = await supabase
      .from('administrators')
      .select('*')
      .eq('id', signInData.user.id)
      .maybeSingle();

    if (adminData) {
      return { success: true, redirectTo: "/profil" };
    }

    // Si ce n'est pas un admin, vérifier le type d'utilisateur normal
    const userType = signInData.user.user_metadata?.user_type;
    
    switch (userType) {
      case 'carrier':
        return { success: true, redirectTo: "/mes-tournees" };
      case 'client':
        // Vérifier s'il y a un chemin de retour stocké
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

// Add the new function for password reset
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Error requesting password reset:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de réinitialisation.",
      });
      return false;
    }

    // Log the email request
    await supabase.from('email_logs').insert([
      {
        email: email,
        status: 'sent',
        email_type: 'password_reset'
      }
    ]);

    toast({
      title: "Email envoyé",
      description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
    });

    return true;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la demande de réinitialisation.",
    });
    return false;
  }
};

// Add function to update password
export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe.",
      });
      return false;
    }

    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
    });

    return true;
  } catch (error) {
    console.error("Error in updatePassword:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la mise à jour du mot de passe.",
    });
    return false;
  }
};