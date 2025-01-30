import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, type FormValues } from "./FormSchema";
import { FormSections } from "./FormSections";
import { useCarrierRegistration } from "@/hooks/useCarrierRegistration";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface CarrierSignupFormProps {
  onSuccess?: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { isLoading, handleRegistration } = useCarrierRegistration(onSuccess);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
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
      siret: null,
      address: "",
      phone_secondary: "",
      coverage_area: ["FR"],
      total_capacity: 0,
      price_per_kg: 0,
      avatar_url: null,
      services: []
    },
  });

  const formValues = form.watch();
  const isValid = form.formState.isValid;

  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Étape {currentStep} sur {totalSteps}</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <FormSections form={form} currentStep={currentStep} />

        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-[120px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="w-[120px]"
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-[120px]"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                "Envoi..."
              ) : (
                <>
                  Envoyer
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Une fois votre demande envoyée, nous vous contacterons pour finaliser votre inscription.
        </p>
      </form>
    </Form>
  );
}