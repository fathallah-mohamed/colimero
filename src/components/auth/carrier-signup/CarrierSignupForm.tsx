import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, type FormValues } from "./FormSchema";
import { useNavigate } from "react-router-dom";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";
import { FormSections } from "./FormSections";
import { useEffect } from "react";

export interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: consentTypes } = useCarrierConsents();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      first_name: "",
      last_name: "",
      company_name: "",
      siret: null,
      address: "",
      phone_secondary: "",
      coverage_area: ["FR"],
      total_capacity: 0,
      price_per_kg: 0,
      avatar_url: null,
      consents: consentTypes?.reduce((acc, consent) => ({
        ...acc,
        [consent.code]: false
      }), {}) || {},
    },
  });

  const formValues = form.watch();
  const isValid = form.formState.isValid;
  const allConsentsAccepted = formValues.consents ? 
    Object.values(formValues.consents).every(value => value === true) : false;

  useEffect(() => {
    console.log("Form values:", formValues);
    console.log("Form is valid:", isValid);
    console.log("All consents accepted:", allConsentsAccepted);
    console.log("Form errors:", form.formState.errors);
  }, [formValues, isValid, allConsentsAccepted, form.formState.errors]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error: registrationError } = await supabase
        .from("carriers")
        .insert({
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
          siret: values.siret || null,
          phone: values.phone,
          phone_secondary: values.phone_secondary,
          address: values.address,
          coverage_area: values.coverage_area,
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
          avatar_url: values.avatar_url,
          password: values.password,
          status: 'pending',
          company_details: {},
          authorized_routes: ["FR_TO_TN", "TN_TO_FR"],
          total_deliveries: 0,
          cities_covered: 30,
          email_verified: false
        });

      if (registrationError) throw registrationError;

      toast({
        title: "Demande envoyée avec succès",
        description: "Nous examinerons votre demande dans les plus brefs délais. Vous recevrez un email de confirmation.",
      });

      onSuccess();
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSections form={form} />

        <div className="mt-8 text-center">
          <Button 
            type="submit" 
            className="w-full max-w-md button-gradient text-white py-6 text-lg font-semibold"
            disabled={!isValid || !allConsentsAccepted}
          >
            Envoyer ma demande d'inscription
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Une fois votre demande envoyée, nous vous contacterons pour finaliser votre inscription.
          </p>
        </div>
      </form>
    </Form>
  );
}