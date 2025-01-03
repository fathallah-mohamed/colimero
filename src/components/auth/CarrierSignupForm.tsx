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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CarrierSignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_capacity: 1000,
      price_per_kg: 12,
      coverage_area: ["FR", "TN"],
      services: [],
      phone_secondary: "",
      avatar_url: null,
      terms_accepted: false,
      customs_terms_accepted: false,
      responsibility_terms_accepted: false,
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            user_type: 'carrier'
          },
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const { error: registrationError } = await supabase
        .from('carrier_registration_requests')
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
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
          services: values.services,
          status: 'pending',
          avatar_url: values.avatar_url,
        });

      if (registrationError) throw registrationError;

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
          phone_secondary: values.phone_secondary,
          address: values.address,
          coverage_area: values.coverage_area,
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Inscription Transporteur</CardTitle>
            <CardDescription>
              Rejoignez notre réseau de transporteurs et développez votre activité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <AvatarUpload form={form} />
            </div>

            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informations personnelles</h3>
                  <PersonalInfoFields form={form} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informations entreprise</h3>
                  <CompanyInfoFields form={form} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Capacités et tarifs</h3>
                  <CapacityFields form={form} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Zone de couverture</h3>
                  <CoverageAreaSelect form={form} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Services proposés</h3>
                  <ServiceOptions form={form} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Engagements</h3>
                  <TermsCheckboxes form={form} />
                </div>
              </div>
            </ScrollArea>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={!form.formState.isValid || !allTermsAccepted}
            >
              <Truck className="mr-2 h-4 w-4" />
              Envoyer ma demande d'inscription
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}