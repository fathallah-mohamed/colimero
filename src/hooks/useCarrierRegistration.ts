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

      // 2. Then create the carrier profile using the auth user's ID
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
          phone_secondary: values.phone_secondary || '',
          address: values.address,
          coverage_area: values.coverage_area,
          avatar_url: '',
          company_details: {},
          authorized_routes: ['FR_TO_TN', 'TN_TO_FR'],
          total_deliveries: 0,
          cities_covered: 30,
          status: 'pending'
        });

      if (carrierError) throw carrierError;

      // 3. Create carrier capacities
      const { error: capacitiesError } = await supabase
        .from('carrier_capacities')
        .insert({
          carrier_id: authData.user.id,
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg
        });

      if (capacitiesError) throw capacitiesError;

      // 4. Create carrier services if provided
      if (values.services?.length > 0) {
        const { error: servicesError } = await supabase
          .from('carrier_services')
          .insert(
            values.services.map((service: string) => ({
              carrier_id: authData.user.id,
              service_type: service,
              icon: "package"
            }))
          );

        if (servicesError) throw servicesError;
      }

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée avec succès.",
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