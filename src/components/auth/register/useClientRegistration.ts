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
    console.log('Starting client registration for:', formData.email);
    
    // 1. Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('email, email_verified')
      .eq('email', formData.email.trim())
      .maybeSingle();

    if (existingClient) {
      console.log('Client already exists:', formData.email);
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
          address: formData.address
        }
      }
    });

    if (signUpError) {
      console.error('Error creating auth user:', signUpError);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: signUpError.message
      });
      throw signUpError;
    }

    if (!authData.user) {
      const error = new Error("Échec de la création du compte");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la création du compte"
      });
      throw error;
    }

    // 3. Force sign out to ensure email verification
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
    console.error("Error in registerClient:", error);
    
    if (error.message?.includes('duplicate key value violates unique constraint')) {
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
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors de l'inscription"
    });
    
    return {
      success: false,
      error: error.message || "Une erreur est survenue lors de l'inscription"
    };
  }
}