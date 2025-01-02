import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOptions } from "./ServiceOptions";
import { CoverageAreaSelect } from "./CoverageAreaSelect";
import { formSchema, type FormValues } from "./carrier-signup/FormSchema";
import { PersonalInfoFields } from "./carrier-signup/PersonalInfoFields";
import { CompanyInfoFields } from "./carrier-signup/CompanyInfoFields";
import { CapacityFields } from "./carrier-signup/CapacityFields";
import { AvatarUpload } from "./carrier-signup/AvatarUpload";
import { TermsCheckboxes } from "./carrier-signup/TermsCheckboxes";

export default function CarrierSignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCapacity: 1000,
      pricePerKg: 12,
      coverageArea: ["FR", "TN"],
      services: [],
      phoneSecondary: "",
      avatar_url: null,
      terms_accepted: false,
      customs_terms_accepted: false,
      responsibility_terms_accepted: false,
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      // Créer d'abord l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            user_type: 'carrier'
          },
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Ensuite, créer la demande d'inscription
      const { error: registrationError } = await supabase
        .from('carrier_registration_requests')
        .insert({
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          company_name: values.companyName,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phoneSecondary,
          address: values.address,
          coverage_area: values.coverageArea,
          total_capacity: values.totalCapacity,
          price_per_kg: values.pricePerKg,
          services: values.services,
          status: 'pending',
          avatar_url: values.avatar_url,
        });

      if (registrationError) throw registrationError;

      // Créer l'entrée dans la table carriers
      const { error: carrierError } = await supabase
        .from('carriers')
        .insert({
          id: authData.user.id,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          company_name: values.companyName,
          siret: values.siret,
          phone: values.phone,
          phone_secondary: values.phoneSecondary,
          address: values.address,
          coverage_area: values.coverageArea,
          status: 'pending'
        });

      if (carrierError) throw carrierError;

      toast({
        title: "Demande envoyée avec succès",
        description: "Votre demande d'inscription a été envoyée pour validation. Vous serez informé par email une fois votre compte activé.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  }

  const allTermsAccepted = form.watch(['terms_accepted', 'customs_terms_accepted', 'responsibility_terms_accepted'])
    .every(value => value === true);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AvatarUpload form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoFields form={form} />
          <CompanyInfoFields form={form} />
          <CapacityFields form={form} />
        </div>

        <CoverageAreaSelect form={form} />
        <ServiceOptions form={form} />
        <TermsCheckboxes form={form} />

        <Button 
          type="submit" 
          className="w-full"
          disabled={!form.formState.isValid || !allTermsAccepted}
        >
          Envoyer ma demande d'inscription
        </Button>
      </form>
    </Form>
  );
}