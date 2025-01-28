import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const authService = {
  async signIn(email: string, password: string, requiredUserType?: UserType): Promise<AuthResult> {
    try {
      console.log('Starting authentication process for:', email);

      // Vérifier d'abord le type d'utilisateur
      let userTypeCheck = await this.checkUserType(email);
      console.log('User type check result:', userTypeCheck);

      if (requiredUserType && userTypeCheck.userType !== requiredUserType) {
        return {
          success: false,
          error: `Ce compte n'est pas un compte ${
            requiredUserType === 'client' ? 'client' : 
            requiredUserType === 'carrier' ? 'transporteur' : 
            'administrateur'
          }`
        };
      }

      // Vérifications spécifiques selon le type d'utilisateur
      if (userTypeCheck.userType === 'client') {
        const clientCheck = await this.checkClientStatus(email);
        if (!clientCheck.success) {
          return clientCheck;
        }
      } else if (userTypeCheck.userType === 'carrier') {
        const carrierCheck = await this.checkCarrierStatus(email);
        if (!carrierCheck.success) {
          return carrierCheck;
        }
      }

      // Tentative de connexion
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        return {
          success: false,
          error: signInError.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion"
        };
      }

      if (!user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  },

  async checkUserType(email: string) {
    // Vérifier dans la table administrators
    const { data: adminData } = await supabase
      .from('administrators')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (adminData) {
      return { userType: 'admin' as UserType };
    }

    // Vérifier dans la table carriers
    const { data: carrierData } = await supabase
      .from('carriers')
      .select('id, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (carrierData) {
      return { userType: 'carrier' as UserType };
    }

    // Vérifier dans la table clients
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientData) {
      return { userType: 'client' as UserType };
    }

    return { userType: null };
  },

  async checkClientStatus(email: string): Promise<AuthResult> {
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    if (!clientData) {
      return {
        success: false,
        error: "Compte client non trouvé"
      };
    }

    if (!clientData.email_verified || clientData.status !== 'active') {
      return {
        success: false,
        needsVerification: true,
        error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
      };
    }

    return { success: true };
  },

  async checkCarrierStatus(email: string): Promise<AuthResult> {
    const { data: carrierData } = await supabase
      .from('carriers')
      .select('status')
      .eq('email', email.trim())
      .maybeSingle();

    if (!carrierData) {
      return {
        success: false,
        error: "Compte transporteur non trouvé"
      };
    }

    if (carrierData.status === 'pending') {
      return {
        success: false,
        error: "Votre compte est en attente de validation par un administrateur"
      };
    }

    if (carrierData.status === 'rejected') {
      return {
        success: false,
        error: "Votre demande d'inscription a été rejetée"
      };
    }

    if (carrierData.status !== 'active') {
      return {
        success: false,
        error: "Votre compte n'est pas actif"
      };
    }

    return { success: true };
  }
};