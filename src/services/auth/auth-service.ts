import { supabase } from "@/integrations/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { authVerificationService } from "./auth-verification";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

interface SignInResponse {
  data: {
    user: User | null;
  };
  error: AuthError | null;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error }: SignInResponse = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Sign in error:", error);
        return {
          success: false,
          error: error.message === "Invalid login credentials" 
            ? "Email ou mot de passe incorrect"
            : "Une erreur est survenue lors de la connexion"
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: error instanceof AuthError ? error.message : "Une erreur inattendue s'est produite"
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  },

  validateUserType(user: User, requiredType?: 'client' | 'carrier'): AuthResponse {
    const validation = authVerificationService.validateUserType(user, requiredType);
    return {
      success: validation.success,
      error: validation.error,
      user: validation.success ? user : undefined
    };
  }
};