import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // 1. Vérifier d'abord si le client existe et son statut de vérification
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        return {
          success: false,
          error: "Une erreur est survenue lors de la vérification de votre compte"
        };
      }

      // 2. Si le client existe mais n'est pas vérifié ou en attente, bloquer la connexion
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log('Account not verified or pending:', email);
        
        // Essayer de renvoyer l'email d'activation
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
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email pour le lien d'activation."
        };
      }

      // 3. Tenter la connexion uniquement si le compte est vérifié
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
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

      if (!user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      // 4. Vérification finale après la connexion
      const { data: finalCheck } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('id', user.id)
        .single();

      if (!finalCheck?.email_verified || finalCheck?.status !== 'active') {
        await supabase.auth.signOut();
        return {
          success: false,
          needsVerification: true,
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email."
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
  }
};