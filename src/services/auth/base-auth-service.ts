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
    
    try {
      const response = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      console.log('Sign in response:', response);
      
      if (response.error) {
        console.error('Sign in error:', response.error);
      } else if (response.data.user) {
        console.log('User successfully authenticated:', response.data.user.id);
      }

      return response;
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      throw error;
    }
  }

  protected handleAuthError(error: AuthError): AuthResult {
    console.error('Auth error:', error);
    
    if (error.message.includes("Invalid login credentials")) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect"
      };
    }

    if (error.message.includes("Email not confirmed")) {
      return {
        success: false,
        error: "Email non vérifié",
        needsVerification: true
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion"
    };
  }
}