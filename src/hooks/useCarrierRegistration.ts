import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { FormValues } from "@/components/auth/carrier-signup/FormSchema";

export function useCarrierRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegistration = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Créer l'utilisateur auth
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
      if (!authData.user) throw new Error("Aucune donnée utilisateur retournée");

      // Attendre que l'utilisateur soit créé
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer le profil transporteur
      const { error: carrierError } = await supabase
        .from("carriers")
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
          avatar_url: values.avatar_url || "",
          status: "pending"
        });

      if (carrierError) throw carrierError;

      // Créer les capacités du transporteur
      const { error: capacitiesError } = await supabase
        .from('carrier_capacities')
        .insert({
          carrier_id: authData.user.id,
          total_capacity: values.total_capacity || 1000,
          price_per_kg: values.price_per_kg || 12
        });

      if (capacitiesError) throw capacitiesError;

      // Créer les services du transporteur si fournis
      if (values.services?.length > 0) {
        const { error: servicesError } = await supabase
          .from('carrier_services')
          .insert(
            values.services.map(service => ({
              carrier_id: authData.user.id,
              service_type: service,
              icon: "package"
            }))
          );

        if (servicesError) throw servicesError;
      }

      // Envoyer l'email de notification à l'admin
      await supabase.functions.invoke('send-registration-email', {
        body: { 
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name
        }
      });

      toast({
        title: "Demande envoyée avec succès",
        description: "Nous examinerons votre demande dans les plus brefs délais. Vous recevrez un email de confirmation.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
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