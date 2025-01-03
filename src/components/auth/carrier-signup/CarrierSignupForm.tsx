import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormSchema, FormValues } from "./FormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { CapacityFields } from "./CapacityFields";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { ServiceOptions } from "../ServiceOptions";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { AvatarUpload } from "./AvatarUpload";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CarrierSignupFormProps {
  onSuccess: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coverage_area: ["FR", "TN"],
      services: [],
      terms_accepted: false,
      customs_declaration: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) throw signUpError;

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
          total_capacity: values.total_capacity,
          price_per_kg: values.price_per_kg,
          services: values.services,
          avatar_url: values.avatar_url,
        });

      if (registrationError) throw registrationError;

      toast({
        title: "Inscription réussie",
        description: "Votre demande d'inscription a été envoyée avec succès.",
      });

      onSuccess();
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-center">
                <AvatarUpload form={form} />
              </div>
              <Separator />
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
            </div>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-full max-w-md"
            disabled={!form.getValues("terms_accepted") || !form.getValues("customs_declaration")}
          >
            Créer mon compte
          </Button>
        </div>
      </form>
    </Form>
  );
}