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
      const { data, error } = await supabase
        .from("carriers")
        .insert({
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
          status: "pending",
          password: values.password
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Create carrier capacities
        await supabase
          .from("carrier_capacities")
          .insert({
            carrier_id: data.id,
            total_capacity: values.totalCapacity,
            price_per_kg: values.pricePerKg
          });

        // Create carrier services
        if (values.services?.length > 0) {
          await supabase
            .from("carrier_services")
            .insert(
              values.services.map((service: string) => ({
                carrier_id: data.id,
                service_type: service,
                icon: "package"
              }))
            );
        }
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