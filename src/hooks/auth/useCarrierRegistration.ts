import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useCarrierRegistration(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      // Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'carrier',
            first_name: values.firstName,
            last_name: values.lastName,
            company_name: values.companyName
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Créer le profil transporteur
      const { error: profileError } = await supabase
        .from('carriers')
        .insert({
          id: authData.user.id,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          phone_secondary: values.phoneSecondary || '',
          company_name: values.companyName,
          siret: values.siret,
          address: values.address,
          coverage_area: values.coverageArea,
          status: 'pending'
        });

      if (profileError) throw profileError;

      // Se déconnecter immédiatement après l'inscription
      await supabase.auth.signOut();

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée. Vous recevrez un email une fois votre compte validé par un administrateur."
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/connexion');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
}