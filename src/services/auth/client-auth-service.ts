import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

interface ActivationResult {
  success: boolean;
  error?: string;
}

export const clientAuthService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting login for:', email);
      
      // First check client verification status
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        return {
          success: false,
          error: "Erreur lors de la vérification du compte"
        };
      }

      // If client exists but isn't verified, handle verification flow
      if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
        console.log('Account needs verification:', email);
        
        // Try to resend activation email
        const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
          body: { 
            email: email.trim(),
            resend: true
          }
        });

        if (functionError) {
          console.error('Error sending activation email:', functionError);
        }

        return {
          success: false,
          needsVerification: true,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
        };
      }

      // Attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
        };
      }

      // Ensure we have a session
      if (!authData.session) {
        console.error('No session data received');
        return {
          success: false,
          error: "Erreur lors de la connexion"
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return {
        success: false,
        error: "Une erreur inattendue s'est produite"
      };
    }
  },

  async activateAccount(activationCode: string, email: string): Promise<ActivationResult> {
    try {
      console.log('Activating account with code:', activationCode);
      
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: activationCode
        });

      if (error) {
        console.error('Error activating account:', error);
        return {
          success: false,
          error: "Code d'activation invalide ou expiré"
        };
      }

      if (!data) {
        return {
          success: false,
          error: "Code d'activation invalide"
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error in activateAccount:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'activation"
      };
    }
  }
};