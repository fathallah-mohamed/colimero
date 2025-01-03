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
import { Truck, User, Building2, Map, Scale } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personnel
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Entreprise
                </TabsTrigger>
                <TabsTrigger value="coverage" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Couverture
                </TabsTrigger>
                <TabsTrigger value="capacity" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Capacités
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <PersonalInfoFields form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <CompanyInfoFields form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coverage" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <CoverageAreaSelect form={form} />
                    <div className="mt-6">
                      <ServiceOptions form={form} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="capacity" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <CapacityFields form={form} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <TermsCheckboxes form={form} />
            </div>

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