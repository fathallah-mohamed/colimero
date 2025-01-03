import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, type FormValues } from "./FormSchema";

export function useCarrierSignup(onSuccess: () => void) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      first_name: "",
      last_name: "",
      company_name: "",
      siret: "",
      address: "",
      phone_secondary: "",
      coverage_area: [],
      services: [],
      total_capacity: 0,
      price_per_kg: 0,
      avatar_url: null,
      terms_accepted: false,
      customs_declaration: false,
      responsibility_terms_accepted: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            user_type: "carrier",
          },
        },
      });

      if (authError) throw authError;

      const { error: registrationError } = await supabase
        .from("carrier_registration_requests")
        .insert({
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phone_secondary,
          address: values.address,
          coverage_area: values.coverage_area,
          services: values.services,
        });

      if (registrationError) throw registrationError;

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée avec succès",
      });

      onSuccess();
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
}