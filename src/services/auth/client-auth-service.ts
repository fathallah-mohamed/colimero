import { supabase } from "@/integrations/supabase/client";

interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

export const clientAuthService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Attempting login for:', email);
      
      // 1. First check if the client exists and their verification status
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

      // 2. If client exists but not verified or pending, block login
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log('Account not verified or pending:', email);
        
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
          error: "Votre compte n'est pas activé. Veuillez vérifier votre email pour le lien d'activation."
        };
      }

      // 3. Attempt login only if account is verified
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

      // 4. Final verification check after login
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