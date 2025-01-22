import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export function useCarrierSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const carrierId = uuidv4();

      // Create carrier profile
      const { error: carrierError } = await supabase
        .from("carriers")
        .insert({
          id: carrierId,
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
          status: "pending",
          password: values.password,
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          email_verified: false
        });

      if (carrierError) throw carrierError;

      // Create carrier capacities
      const { error: capacityError } = await supabase
        .from("carrier_capacities")
        .insert({
          carrier_id: carrierId,
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
          offers_home_delivery: false
        });

      if (capacityError) throw capacityError;

      // Create carrier services
      if (values.services?.length > 0) {
        const { error: servicesError } = await supabase
          .from("carrier_services")
          .insert(
            values.services.map((service: string) => ({
              carrier_id: carrierId,
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