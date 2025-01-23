import { supabase } from "@/integrations/supabase/client";
import crypto from 'crypto';

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
    
    // 1. Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', formData.email);
      return { 
        success: false, 
        error: "Un compte existe déjà avec cet email"
      };
    }

    // 2. Create auth user first
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password.trim(),
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          user_type: 'client',
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

    // 3. Create client profile
    const { error: insertError } = await supabase
      .from('clients')
      .insert({
        id: authData.user.id,
        email: formData.email.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        phone_secondary: formData.phone_secondary || '',
        address: formData.address || '',
        email_verified: false,
        activation_token: crypto.randomUUID(),
        activation_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      });

    if (insertError) {
      console.error('Error creating client profile:', insertError);
      // Clean up auth user if profile creation fails
      await supabase.auth.signOut();
      throw insertError;
    }

    // 4. Send activation email
    const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
      body: {
        email: formData.email,
        firstName: formData.firstName
      }
    });

    if (emailError) {
      console.error('Error sending activation email:', emailError);
      throw emailError;
    }

    console.log('Activation email sent successfully');

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