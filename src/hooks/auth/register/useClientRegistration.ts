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

interface ActivationCodeResult {
  success: boolean;
  activation_code: string;
  message: string;
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
        console.log('Sending new activation code for unverified client');
        
        // Generate new activation code
        const { data: newCodeData, error: codeError } = await supabase
          .rpc('generate_new_activation_code', {
            p_email: formData.email.trim()
          });

        if (codeError) {
          console.error('Error generating new code:', codeError);
          throw codeError;
        }

        const activationResult = newCodeData[0] as ActivationCodeResult;
        
        if (!activationResult.success) {
          throw new Error(activationResult.message);
        }

        // Send activation email
        const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
          body: { 
            email: formData.email.trim(),
            firstName: formData.firstName,
            activationCode: activationResult.activation_code,
            resend: true
          }
        });

        if (emailError) {
          console.error('Error sending activation email:', emailError);
          throw emailError;
        }

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
          address: formData.address,
          email: formData.email
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

    // 3. Wait for the database trigger to create the client record and generate activation code
    console.log('Waiting for client record creation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Get the activation code
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('activation_code')
      .eq('email', formData.email.trim())
      .single();

    if (clientError || !clientData?.activation_code) {
      console.error('Error getting activation code:', clientError);
      throw new Error('Impossible de récupérer le code d\'activation');
    }

    // 5. Send activation email
    const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
      body: { 
        email: formData.email.trim(),
        firstName: formData.firstName,
        activationCode: clientData.activation_code,
        resend: false
      }
    });

    if (emailError) {
      console.error('Error sending activation email:', emailError);
      throw emailError;
    }

    // 6. Force sign out to ensure email verification flow
    await supabase.auth.signOut();

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