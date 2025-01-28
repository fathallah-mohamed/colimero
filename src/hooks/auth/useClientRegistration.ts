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

    // 3. Create auth user with minimal metadata
    console.log('Creating auth user...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: formData.password.trim(),
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          user_type: 'client'
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

    // 4. Sign out to ensure email verification
    await supabase.auth.signOut();

    return {
      success: true,
      type: 'new'
    };

  } catch (error: any) {
    console.error("Error in registerClient:", error);
    
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