import { supabase } from "@/integrations/supabase/client";
import { RegisterFormState } from "./types";

interface RegistrationResponse {
  success: boolean;
  error?: string;
  type?: 'new' | 'existing';
}

export async function registerClient(formData: RegisterFormState): Promise<RegistrationResponse> {
  try {
    console.log('Starting client registration for:', formData.email);
    
    // 1. Vérifier si l'utilisateur existe déjà
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', formData.email);
      return { 
        success: true, 
        type: 'existing' 
      };
    }

    // 2. Créer l'utilisateur dans auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
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
      console.error('Error in auth signup:', signUpError);
      throw signUpError;
    }
    
    if (!authData.user) {
      console.error('No user data received from auth signup');
      throw new Error("Aucune donnée utilisateur reçue");
    }

    console.log('Auth signup successful for:', formData.email);

    // 3. Créer le profil client avec upsert pour éviter les doublons
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
        email_verified: false,
        activation_token: crypto.randomUUID(),
        activation_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      });

    if (clientError) {
      console.error('Error creating client profile:', clientError);
      throw clientError;
    }

    console.log('Client profile created successfully with email_verified=false');

    // 4. Envoyer l'email d'activation
    const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
      body: { email: formData.email.trim() }
    });

    if (emailError) {
      console.error('Error sending activation email:', emailError);
      throw emailError;
    }

    console.log('Activation email sent successfully');

    // 5. Déconnexion immédiate pour forcer la vérification email
    await supabase.auth.signOut();

    return {
      success: true,
      type: 'new'
    };

  } catch (error: any) {
    console.error("Error in registerClient:", error);
    
    // Gérer spécifiquement l'erreur de clé dupliquée
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