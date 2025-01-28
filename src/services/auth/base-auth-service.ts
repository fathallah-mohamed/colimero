import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthResult {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
  needsValidation?: boolean;
}

export class BaseAuthService {
  protected async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    console.log('Attempting sign in for:', email);
    return await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });
  }

  protected handleAuthError(error: AuthError): AuthResult {
    console.error('Auth error:', error);
    
    if (error.message.includes("Invalid login credentials")) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect"
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion"
    };
  }
}