import { supabase } from "@/integrations/supabase/client";
import { RegistrationResult } from "./types";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  address: string;
  password: string;
}

export async function registerClient(formData: RegisterFormData): Promise<RegistrationResult> {
  try {
    console.log('Starting client registration for:', formData.email);
    
    // 1. Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified, status')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', existingClient);
      
      // If client exists but isn't verified, allow them to get a new code
      if (!existingClient.email_verified) {
        return { 
          success: true,
          type: 'existing',
          needsVerification: true,
          email: formData.email
        };
      }
      
      return { 
        success: false, 
        error: "Un compte existe déjà avec cet email"
      };
    }

    // 2. Create auth user with metadata
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address
        },
        emailRedirectTo: `${window.location.origin}/activation`
      }
    });

    if (signUpError) {
      console.error('Error creating auth user:', signUpError);
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error("Échec de la création du compte");
    }

    console.log('Auth user created successfully:', authData.user.id);

    // 3. Wait for client record to be created by trigger
    console.log('Waiting for client record creation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Sign out to ensure email verification flow
    await supabase.auth.signOut();

    // 5. Verify client record was created
    const { data: clientRecord, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (clientError || !clientRecord) {
      console.error('Client record not found after creation:', clientError);
      throw new Error("Erreur lors de la création du profil client");
    }

    return {
      success: true,
      type: 'new',
      needsVerification: true,
      email: formData.email
    };

  } catch (error: any) {
    console.error("Complete error in registerClient:", error);
    
    if (error.message?.includes('duplicate key value violates unique constraint')) {
      return {
        success: false,
        error: "Un compte existe déjà avec cet email"
      };
    }
    
    return {
      success: false,
      error: error.message || "Une erreur est survenue lors de l'inscription"
    };
  }
}