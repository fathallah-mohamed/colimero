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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";

export interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: consents } = useCarrierConsents();
  
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
      consents: consents?.reduce((acc, consent) => ({
        ...acc,
        [consent.code]: false
      }), {}) || {},
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
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

      // Insert consents
      const consentPromises = Object.entries(values.consents).map(([code, accepted]) => 
        supabase.from("user_consents").insert({
          user_id: values.email, // Using email as temporary ID since we don't have user_id yet
          consent_type_id: consents?.find(c => c.code === code)?.id,
          accepted,
          accepted_at: accepted ? new Date().toISOString() : null,
        })
      );

      await Promise.all(consentPromises);

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

  // Watch consents field and check if all consents are accepted
  const consents = form.watch("consents");
  const allConsentsAccepted = consents ? Object.values(consents).every(value => value === true) : false;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8 bg-gradient-primary p-8 rounded-lg text-white">
        <h1 className="text-3xl font-bold mb-3">
          Rejoignez notre réseau de transporteurs !
        </h1>
        <p className="text-lg opacity-90">
          Inscrivez-vous dès aujourd'hui pour accéder à des tournées optimisées et développer votre activité. 
          Remplissez les informations ci-dessous, et notre équipe examinera votre demande rapidement.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            <div className="grid gap-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
                <ContactInfoFields form={form} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                <PersonalInfoFields form={form} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations de l'entreprise</h2>
                <CompanyInfoFields form={form} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Zone de couverture</h2>
                <CoverageAreaSelect form={form} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Services proposés</h2>
                <ServiceOptions form={form} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Conditions et engagements</h2>
                <TermsCheckboxes form={form} />
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button 
                type="submit" 
                className="w-full max-w-md button-gradient text-white py-6 text-lg font-semibold"
                disabled={!form.formState.isValid || !allConsentsAccepted}
              >
                Envoyer ma demande d'inscription
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Une fois votre demande envoyée, nous vous contacterons pour finaliser votre inscription.
              </p>
            </div>
          </ScrollArea>
        </form>
      </Form>
    </div>
  );
}