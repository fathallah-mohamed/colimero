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

export async function registerClient(formData: RegisterFormData) {
  try {
    console.log('Starting client registration for:', formData.email);
    
    // 1. Normalize email
    const normalizedEmail = formData.email.trim().toLowerCase();
    
    // 2. Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', normalizedEmail);
      return { 
        success: false, 
        error: "Un compte existe déjà avec cet email"
      };
    }

    // 3. Create auth user with proper metadata
    console.log('Creating auth user...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: formData.password.trim(),
      options: {
        data: {
          user_type: 'client',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address
        }
      }
    });

    if (signUpError) {
      console.error('Error creating auth user:', signUpError);
      if (signUpError.message.includes('Database error saving new user')) {
        return {
          success: false,
          error: "Erreur lors de la création du compte. Veuillez réessayer."
        };
      }
      return {
        success: false,
        error: signUpError.message
      };
    }

    if (!authData.user) {
      throw new Error("Échec de la création du compte");
    }

    console.log('Auth user created successfully:', authData.user.id);

    // 4. Force sign out to ensure email verification flow
    await supabase.auth.signOut();

    return {
      success: true,
      type: 'new',
      email: normalizedEmail
    };

  } catch (error: any) {
    console.error("Complete error in registerClient:", error);
    
    if (error.message?.includes('duplicate key value')) {
      return {
        success: false,
        error: "Un compte existe déjà avec cet email"
      };
    }
    
    return {
      success: false,
      error: "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
    };
  }
}