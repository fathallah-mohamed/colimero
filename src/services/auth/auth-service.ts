import { supabase } from "@/integrations/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { userTypeValidator } from "./validation/user-type-validator";
import { authErrorHandler } from "./errors/auth-error-handler";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        const errorResponse = authErrorHandler.handle(error);
        return {
          success: false,
          error: errorResponse.message
        };
      }

      if (!user) {
        return {
          success: false,
          error: "Aucune donnée utilisateur reçue"
        };
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: "Une erreur est survenue lors de la connexion"
      };
    }
  },

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  validateUserType(user: User, requiredType?: 'client' | 'carrier'): AuthResponse {
    const validation = userTypeValidator.validate(user, requiredType);
    return {
      success: validation.success,
      error: validation.error,
      user: validation.success ? user : undefined
    };
  }
};