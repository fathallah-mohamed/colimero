import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { CoverageAreaSelect } from "@/components/auth/CoverageAreaSelect";
import { ServiceOptions } from "@/components/auth/ServiceOptions";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { carrierSignupSchema, type CarrierSignupFormValues } from "./FormSchema";

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { toast } = useToast();
  
  const form = useForm<CarrierSignupFormValues>({
    resolver: zodResolver(carrierSignupSchema),
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
      terms_accepted: false,
      customs_declaration: false,
      responsibility_terms_accepted: false,
    },
  });

  const onSubmit = async (values: CarrierSignupFormValues) => {
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
          disabled={!form.formState.isValid}
        >
          S'inscrire
        </Button>
      </form>
    </Form>
  );
}