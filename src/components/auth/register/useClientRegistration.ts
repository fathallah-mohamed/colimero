import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  console.log("Registering client with data:", {
    ...formData,
    password: "***hidden***"
  });

  try {
    // First check if user exists
    const { data: existingUser } = await supabase
      .from('clients')
      .select('email')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingUser) {
      return { 
        data: null, 
        error: new Error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter.") 
      };
    }

    // Create auth user with proper metadata
    const signUpData = {
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: 'client',
        },
      },
    };

    console.log("Signing up user with auth service...");
    const { data: authData, error: authError } = await supabase.auth.signUp(signUpData);

    if (authError) {
      console.error("Auth error during signup:", {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });

      // Handle specific error cases
      if (authError.message === "User already registered") {
        return { 
          data: null, 
          error: new Error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter.") 
        };
      }

      return { data: null, error: authError };
    }

    if (!authData.user) {
      console.error("No user data received from auth service");
      return {
        data: null,
        error: new Error("Une erreur est survenue lors de la création du compte")
      };
    }

    console.log("Auth signup successful, user created");
    return { data: authData, error: null };

  } catch (error: any) {
    console.error("Unexpected error during registration:", error);
    return {
      data: null,
      error: new Error(error.message || "Une erreur inattendue s'est produite")
    };
  }
}