import { AuthError } from "@supabase/supabase-js";
import { AuthErrorResponse } from "@/types/auth";

export const authErrorHandler = {
  handle(error: AuthError): AuthErrorResponse {
    console.error("Auth error:", error);

    if (error.message === "Invalid login credentials") {
      return { message: "Email ou mot de passe incorrect" };
    }

    if (error.message === "Email not confirmed") {
      return { 
        message: "Veuillez vérifier votre email pour activer votre compte",
        requiresVerification: true
      };
    }

    return { message: "Une erreur est survenue lors de la connexion" };
  }
};