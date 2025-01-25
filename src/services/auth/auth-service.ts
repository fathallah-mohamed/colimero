import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const authService = {
  async signIn(email: string, password: string) {
    try {
      console.log("Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error("Auth service error:", error);
      return { 
        error: error instanceof AuthError ? error : new Error("Une erreur inattendue s'est produite") 
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
  }
};