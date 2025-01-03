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

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
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
          S'inscrire
        </Button>
      </form>
    </Form>
  );
}