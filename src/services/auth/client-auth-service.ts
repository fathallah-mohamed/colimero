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
      
      // 1. First attempt to sign in
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

      if (!authData.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      // 2. After successful sign in, check client verification status
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('id', authData.user.id)
        .single();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        // Sign out the user since we couldn't verify their status
        await supabase.auth.signOut();
        return {
          success: false,
          error: "Erreur lors de la vérification du compte"
        };
      }

      // 3. Check verification status
      if (!clientData?.email_verified || clientData?.status !== 'active') {
        console.log('Account not verified or not active:', email);
        // Sign out the user since they're not verified
        await supabase.auth.signOut();
        
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