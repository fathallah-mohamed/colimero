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

      // 1. First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'carrier',
            first_name: values.first_name,
            last_name: values.last_name,
            company_name: values.company_name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user data returned");

      // 2. Create the carrier profile using the auth user's ID
      const { error: carrierError } = await supabase
        .from('carriers')
        .insert({
          id: authData.user.id,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phone_secondary || "",
          address: values.address,
          coverage_area: values.coverage_area,
          avatar_url: "",
          company_details: {},
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          status: "pending"
        });

      if (carrierError) throw carrierError;

      // 3. Send confirmation emails
      await Promise.all([
        // Send email to carrier
        supabase.functions.invoke('send-carrier-registration-email', {
          body: {
            email: values.email,
            company_name: values.company_name,
            first_name: values.first_name,
            last_name: values.last_name
          }
        }),
        // Send notification to admin
        supabase.functions.invoke('send-registration-email', {
          body: {
            email: values.email,
            company_name: values.company_name,
            first_name: values.first_name,
            last_name: values.last_name
          }
        })
      ]);

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