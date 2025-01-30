import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCarrierRegistration(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegistration = async (values: any) => {
    try {
      setIsLoading(true);
      console.log("Starting registration process...");

      const id = crypto.randomUUID();

      // 1. Créer l'enregistrement dans la table carriers
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .insert({
          id,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          phone: values.phone,
          phone_secondary: values.phone_secondary || '',
          siret: values.siret,
          address: values.address,
          coverage_area: values.coverage_area,
          status: 'pending',
          avatar_url: '',
          email_verified: false,
          company_details: {},
          authorized_routes: ['FR_TO_TN', 'TN_TO_FR'],
          total_deliveries: 0,
          cities_covered: 30
        })
        .select()
        .single();

      if (carrierError) throw carrierError;

      console.log("Carrier record created:", carrierData);

      // 2. Envoyer l'email de confirmation au transporteur
      const { error: registrationEmailError } = await supabase.functions.invoke(
        'send-carrier-registration-email',
        {
          body: {
            email: values.email,
            company_name: values.company_name,
            first_name: values.first_name,
            last_name: values.last_name
          }
        }
      );

      if (registrationEmailError) {
        console.error("Error sending registration email:", registrationEmailError);
      }

      // 3. Envoyer l'email de notification à l'admin
      const { error: adminEmailError } = await supabase.functions.invoke(
        'send-registration-email',
        {
          body: {
            email: values.email,
            company_name: values.company_name,
            first_name: values.first_name,
            last_name: values.last_name
          }
        }
      );

      if (adminEmailError) {
        console.error("Error sending admin notification:", adminEmailError);
      }

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée. Vous recevrez un email de confirmation.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegistration
  };
}