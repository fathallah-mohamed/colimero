import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOptions } from "../ServiceOptions";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { formSchema, type FormValues } from "./FormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";
import { AvatarUpload } from "./AvatarUpload";
import { useEffect } from "react";

export interface CarrierSignupFormProps {
  onSuccess: () => void;
}

const CarrierSignupForm = ({ onSuccess }: CarrierSignupFormProps) => {
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
      siret: "",
      address: "",
      phone_secondary: "",
      coverage_area: ["FR"],
      services: [],
      total_capacity: 0,
      price_per_kg: 0,
      avatar_url: null,
      consents: consentTypes?.reduce((acc, consent) => ({
        ...acc,
        [consent.code]: false
      }), {}) || {},
    },
  });

  // Watch form values for validation
  const formValues = form.watch();
  const isValid = form.formState.isValid;
  const allConsentsAccepted = formValues.consents ? Object.values(formValues.consents).every(value => value === true) : false;

  // Debug logs
  useEffect(() => {
    console.log("Form values:", formValues);
    console.log("Form is valid:", isValid);
    console.log("All consents accepted:", allConsentsAccepted);
    console.log("Form errors:", form.formState.errors);
  }, [formValues, isValid, allConsentsAccepted, form.formState.errors]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error: registrationError, data: registrationData } = await supabase
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
          avatar_url: values.avatar_url,
        })
        .select()
        .single();

      if (registrationError) throw registrationError;

      // Insert consents using the registration request ID
      if (registrationData) {
        const consentPromises = Object.entries(values.consents).map(([code, accepted]) => 
          supabase.from("user_consents").insert({
            user_id: registrationData.id,
            consent_type_id: consentTypes?.find(c => c.code === code)?.id,
            accepted,
            accepted_at: accepted ? new Date().toISOString() : null,
          })
        );

        await Promise.all(consentPromises);
      }

      // Envoyer l'email à l'administrateur
      const { error: emailError } = await supabase.functions.invoke("send-registration-email", {
        body: {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          company_name: values.company_name,
        },
      });

      if (emailError) {
        console.error("Error sending admin notification:", emailError);
      }

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
                <h2 className="text-xl font-semibold mb-6">Photo de profil</h2>
                <AvatarUpload form={form} />
              </Card>

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
                disabled={!isValid || !allConsentsAccepted}
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
};

export default CarrierSignupForm;