import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useCarrierRegistration(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      console.log("Starting registration process...");

      // Check if email exists in any user table
      const [{ data: clientData }, { data: carrierData }, { data: adminData }] = await Promise.all([
        supabase.from('clients').select('id').eq('email', values.email.trim()).maybeSingle(),
        supabase.from('carriers').select('id').eq('email', values.email.trim()).maybeSingle(),
        supabase.from('administrators').select('id').eq('email', values.email.trim()).maybeSingle()
      ]);

      if (clientData || carrierData || adminData) {
        toast({
          variant: "destructive",
          title: "Email non disponible",
          description: "Cet email ne peut pas être utilisé pour créer un compte. Veuillez en utiliser un autre.",
        });
        return;
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-12);
      console.log("Generated temporary password");

      // 1. First create the auth user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: tempPassword,
        options: {
          data: {
            user_type: 'carrier',
            first_name: values.first_name,
            last_name: values.last_name,
            company_name: values.company_name
          },
          emailRedirectTo: `${window.location.origin}/connexion`
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
          status: 'pending',
          password: tempPassword // Store the temporary password for later use
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

      // 5. Send registration notification emails
      try {
        // Send email to carrier
        await supabase.functions.invoke('send-carrier-registration-email', {
          body: {
            email: values.email,
            company_name: values.company_name
          }
        });

        // Send email to admin
        await supabase.functions.invoke('send-admin-notification-email', {
          body: {
            carrierEmail: values.email,
            companyName: values.company_name,
            adminEmail: 'admin@colimero.com'
          }
        });
      } catch (emailError) {
        console.error("Error sending notification emails:", emailError);
        // Don't throw here as the registration was successful
      }

      // 6. Déconnexion immédiate pour éviter l'accès
      await supabase.auth.signOut();

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée avec succès. Un administrateur examinera votre demande et vous recevrez un email de confirmation une fois votre compte approuvé.",
      });

      navigate('/connexion');

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