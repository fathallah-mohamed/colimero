import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { CompanyInfoFields } from "./CompanyInfoFields";
import { CapacityFields } from "./CapacityFields";
import { CoverageAreaSelect } from "../CoverageAreaSelect";
import { TermsCheckboxes } from "./TermsCheckboxes";
import { formSchema } from "./FormSchema";
import { supabase } from "@/integrations/supabase/client";

type FormValues = typeof formSchema;

export function CarrierSignupForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company_name: "",
      siret: "",
      address: "",
      phone_secondary: "",
      total_capacity: 1000,
      price_per_kg: 12,
      coverage_area: ["FR", "TN"],
      terms_accepted: false,
      customs_declaration: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("carrier_registration_requests").insert({
        ...values,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'inscription a été envoyée avec succès",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 space-y-6 bg-white shadow-lg rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Inscription Transporteur
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Rejoignez notre réseau de transporteurs de confiance
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section Informations Personnelles */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informations personnelles
                </h2>
                <PersonalInfoFields form={form} />
              </div>

              {/* Section Informations Entreprise */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informations entreprise
                </h2>
                <CompanyInfoFields form={form} />
              </div>

              {/* Section Capacités et tarifs */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Capacités et tarifs
                </h2>
                <CapacityFields form={form} />
              </div>

              {/* Section Zone de couverture */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Zone de couverture
                </h2>
                <CoverageAreaSelect form={form} />
              </div>

              {/* Section Déclarations */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Déclarations
                </h2>
                <TermsCheckboxes form={form} />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!form.getValues("terms_accepted") || !form.getValues("customs_declaration")}
                >
                  Envoyer ma demande d'inscription
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}