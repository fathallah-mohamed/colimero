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
      
      const { error } = await supabase
        .from("carriers")
        .insert({
          id: carrierId,
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
          status: "pending",
          password: values.password
        });

      if (error) throw error;

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