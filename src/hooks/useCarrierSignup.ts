import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useCarrierSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      // First, create the auth user
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
      if (!authData.user) throw new Error("No user data returned");

      // Then create the carrier profile using the auth user's ID
      const { error: carrierError } = await supabase
        .from("carriers")
        .insert({
          id: authData.user.id,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          company_name: values.companyName,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phoneSecondary || "",
          address: values.address,
          coverage_area: values.coverageArea,
          avatar_url: "",
          company_details: {},
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          status: "pending"
        });

      if (carrierError) throw carrierError;

      // Create carrier capacities
      const { error: capacitiesError } = await supabase
        .from('carrier_capacities')
        .insert({
          carrier_id: authData.user.id,
          total_capacity: values.totalCapacity,
          price_per_kg: values.pricePerKg
        });

      if (capacitiesError) throw capacitiesError;

      // Create carrier services if provided
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

      navigate("/connexion");
    } catch (error: any) {
      console.error("Error in carrier signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
}