import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    const normalizedEmail = formData.email.trim().toLowerCase();
    console.log('Starting client registration for:', normalizedEmail);
    
    // 1. Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', normalizedEmail);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un compte existe déjà avec cet email"
      });
      return { 
        success: false, 
        error: "Un compte existe déjà avec cet email"
      };
    }

    // 2. Create auth user
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
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (signUpError.message.includes('Password')) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      } else if (signUpError.message.includes('Email')) {
        errorMessage = "L'email n'est pas valide";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
      });
      
      return {
        success: false,
        error: errorMessage
      };
    }

    if (!authData.user) {
      console.error('No user data returned after signup');
      return {
        success: false,
        error: "Erreur lors de la création du compte"
      };
    }

    console.log('Auth user created successfully:', authData.user.id);

    // 3. Sign out to ensure email verification flow
    await supabase.auth.signOut();

    toast({
      title: "Compte créé avec succès",
      description: "Veuillez vérifier votre email pour activer votre compte"
    });

    return {
      success: true,
      type: 'new'
    };

  } catch (error: any) {
    console.error("Complete error in registerClient:", error);
    
    const errorMessage = error.message || "Une erreur est survenue lors de l'inscription";
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: errorMessage
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
}