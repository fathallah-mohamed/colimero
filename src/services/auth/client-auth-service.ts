import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting login for:', email);
      
      // 1. First check client verification status
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("Client verification status:", clientData);

      if (clientError) {
        console.error('Error checking client status:', clientError);
        return {
          success: false,
          error: "Erreur lors de la vérification du compte"
        };
      }

      // 2. Block login if email is not verified
      if (!clientData?.email_verified || clientData.status !== 'active') {
        console.log("Account needs verification:", email);
        
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

      // 3. Only proceed with login if email is verified
      console.log("Email is verified, proceeding with login attempt");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
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

  async activateAccount(activationCode: string, email: string): Promise<AuthResult> {
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

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });

      return { success: true };
    } catch (error) {
      console.error('Error in activateAccount:', error);
      return {
        success: false,
        error: "Une erreur est survenue lors de l'activation"
      };
    }
  }
};