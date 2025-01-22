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

      // Créer directement le transporteur dans la table carriers
      const { error: carrierError } = await supabase
        .from("carriers")
        .insert({
          id: carrierId,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret || null,
          phone: values.phone,
          phone_secondary: values.phone_secondary || "",
          address: values.address,
          coverage_area: values.coverage_area,
          avatar_url: "",
          email_verified: false,
          company_details: {},
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          status: 'pending',
          password: values.password
        });

      if (carrierError) throw carrierError;

      // Créer les capacités du transporteur
      const { error: capacitiesError } = await supabase
        .from('carrier_capacities')
        .insert({
          carrier_id: carrierId,
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg
        });

      if (capacitiesError) throw capacitiesError;

      // Créer les services du transporteur
      if (values.services?.length > 0) {
        const { error: servicesError } = await supabase
          .from('carrier_services')
          .insert(
            values.services.map((service: string) => ({
              carrier_id: carrierId,
              service_type: service,
              icon: 'package'
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