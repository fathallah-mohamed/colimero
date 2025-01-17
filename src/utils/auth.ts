import { supabase } from "@/integrations/supabase/client";

interface AuthResponse {
  success: boolean;
  redirectTo?: string;
  needsVerification?: boolean;
  email?: string;
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
        return { success: false };
      } else if (registrationRequest.status === 'rejected') {
        return { success: false };
      }
    }

    // Vérifier si l'email est vérifié pour les clients
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientData && !clientData.email_verified) {
      return { 
        success: false,
        needsVerification: true,
        email: email
      };
    }

    // Procéder à la connexion si le compte est approuvé ou si ce n'est pas un transporteur
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (signInError) {
      console.error("Erreur d'authentification:", signInError);
      return { success: false };
    }

    if (!signInData.user) {
      throw new Error("Aucune donnée utilisateur reçue");
    }

    // Si c'est un admin
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
    return { success: false };
  }
};

export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Error requesting password reset:", error);
      return false;
    }

    await supabase.from('email_logs').insert([
      {
        email: email,
        status: 'sent',
        email_type: 'password_reset'
      }
    ]);

    return true;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return false;
  }
};

export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error("Error updating password:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return false;
  }
};