import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegisterFormData } from "./types";

export function useRegisterForm(onSuccess: (type: 'new' | 'existing') => void) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Vérification email existant
      const { data: existingUser, error: existingUserError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        throw existingUserError;
      }

      if (existingUser) {
        onSuccess('existing');
        return;
      }

      // Créer le compte utilisateur
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            user_type: 'client',
          },
        },
      });

      if (signUpError) {
        console.error("Erreur inscription:", signUpError);
        throw signUpError;
      }

      // Insertion dans la table clients
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          email_verified: false,
          activation_token: authData.user.id, // Example token
          activation_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiration
        });

      if (insertError) {
        console.error("Erreur insertion client:", insertError);
        throw insertError;
      }

      // Envoyer l'email d'activation
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email: data.email, token: authData.user.id },
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        throw emailError;
      }

      // Afficher la popin de confirmation
      setShowEmailSentDialog(true);

      await supabase.auth.signOut();
      onSuccess('new');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSentDialogClose = () => {
    setShowEmailSentDialog(false);
    navigate('/');
  };

  return {
    handleSubmit,
    isLoading,
    showEmailSentDialog,
    handleEmailSentDialogClose,
  };
}
