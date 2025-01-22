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
      // First create the auth user
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

      // Then create the carrier record using the auth user's ID
      const { error: carrierError } = await supabase
        .from("carriers")
        .insert({
          id: authData.user.id,
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
          company_details: {},
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          status: "pending",
          password: values.password
        });

      if (carrierError) throw carrierError;

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