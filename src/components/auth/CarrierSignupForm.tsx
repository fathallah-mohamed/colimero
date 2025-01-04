import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOptions } from "./ServiceOptions";
import { CoverageAreaSelect } from "./CoverageAreaSelect";
import { formSchema, type FormValues } from "./carrier-signup/FormSchema";
import { PersonalInfoFields } from "./carrier-signup/PersonalInfoFields";
import { CompanyInfoFields } from "./carrier-signup/CompanyInfoFields";
import { ContactInfoFields } from "./carrier-signup/ContactInfoFields";
import { TermsCheckboxes } from "./carrier-signup/TermsCheckboxes";
import { useNavigate } from "react-router-dom";

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      // Create registration request without signing up the user
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
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
        });

      if (registrationError) throw registrationError;

      toast({
        title: "Demande envoyée avec succès",
        description: "Nous examinerons votre demande dans les plus brefs délais. Vous recevrez un email de confirmation.",
      });

      // Close the dialog and redirect to home page
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

  const allTermsAccepted = form.watch(['terms_accepted', 'customs_declaration', 'responsibility_terms_accepted'])
    .every(value => value === true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <ContactInfoFields form={form} />
          <PersonalInfoFields form={form} />
          <CompanyInfoFields form={form} />
          <CoverageAreaSelect form={form} />
          <ServiceOptions form={form} />
          <TermsCheckboxes form={form} />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={!form.formState.isValid || !allTermsAccepted}
        >
          Envoyer la demande
        </Button>
      </form>
    </Form>
  );
}