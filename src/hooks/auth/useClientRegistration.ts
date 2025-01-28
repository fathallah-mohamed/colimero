import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

    // 3. Create auth user first
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

    // 4. Create client profile
    console.log('Creating client profile...');
    const { error: insertError } = await supabase
      .from('clients')
      .insert({
        id: authData.user.id,
        email: normalizedEmail,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        phone_secondary: formData.phone_secondary || '',
        address: formData.address || '',
        email_verified: false,
        status: 'pending'
      });

    if (insertError) {
      console.error('Error creating client profile:', insertError);
      // Clean up auth user if profile creation fails
      await supabase.auth.signOut();
      throw insertError;
    }

    console.log('Client profile created successfully');

    // 5. Force sign out to ensure email verification
    await supabase.auth.signOut();

    return {
      success: true,
      type: 'new'
    };

  } catch (error: any) {
    console.error("Error in registerClient:", error);
    
    // Handle specific errors
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