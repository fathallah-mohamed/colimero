import { supabase } from "@/integrations/supabase/client";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  address: string;
  password: string;
}

type RegistrationType = 'new' | 'existing';

interface RegistrationResult {
  success: boolean;
  type?: RegistrationType;
  error?: string;
  needsVerification?: boolean;
  email?: string;
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

    // 2. Create auth user with proper metadata
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address || null
        }
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

    // 3. Force sign out to ensure email verification flow
    await supabase.auth.signOut();

    return {
      success: true,
      type: 'new',
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