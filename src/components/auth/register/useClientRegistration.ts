import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  console.log("Starting registration process with data:", {
    ...formData,
    password: "[REDACTED]"
  });

  try {
    // Create auth user with proper metadata
    const signUpData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone?.trim(),
          address: formData.address?.trim()
        },
      },
    };

    console.log("Attempting signUp with data:", {
      ...signUpData,
      password: "[REDACTED]"
    });

    const { data: authData, error: authError } = await supabase.auth.signUp(signUpData);

    console.log("SignUp response:", { data: authData, error: authError });

    if (authError) {
      console.error("Auth error details:", {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      return { data: null, error: authError };
    }

    if (!authData.user) {
      throw new Error("No user data received");
    }

    console.log("Auth successful, user created:", authData.user.id);

    // We don't need to create the client profile here anymore
    // It will be created by the database trigger

    return { data: authData, error: null };
  } catch (error: any) {
    console.error("Complete registration error:", error);
    return { data: null, error };
  }
}