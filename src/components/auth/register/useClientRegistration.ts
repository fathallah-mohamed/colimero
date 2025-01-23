import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

export async function registerClient(formData: RegisterFormState) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('clients')
      .select('email')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingUser) {
      return { 
        success: true, 
        type: 'existing' 
      };
    }

    // Créer l'utilisateur dans auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: 'client',
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error("Aucune donnée utilisateur reçue");

    // Créer le profil client
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        id: authData.user.id,
        email: formData.email.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        phone_secondary: formData.phone_secondary || '',
        address: formData.address || '',
        email_verified: false
      });

    if (clientError) throw clientError;

    return {
      success: true,
      type: 'new'
    };

  } catch (error: any) {
    console.error("Error in registerClient:", error);
    return {
      success: false,
      error: error.message,
      type: 'error'
    };
  }
}