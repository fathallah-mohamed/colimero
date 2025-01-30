import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, type FormValues } from "./FormSchema";
import { FormSections } from "./FormSections";
import { useCarrierRegistration } from "@/hooks/useCarrierRegistration";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepIndicator } from "@/components/booking/form/steps/StepIndicator";

interface CarrierSignupFormProps {
  onSuccess?: () => void;
}

export default function CarrierSignupForm({ onSuccess }: CarrierSignupFormProps) {
  const { isLoading, handleRegistration } = useCarrierRegistration(onSuccess);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
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

  const validateStep = async (step: number) => {
    const stepFields = {
      1: ["email", "password", "phone", "phone_secondary"],
      2: ["first_name", "last_name"],
      3: ["company_name", "siret", "address"],
      4: ["coverage_area", "services"],
      5: ["avatar_url"]
    };

    const currentFields = stepFields[step as keyof typeof stepFields];
    if (!currentFields) return true;

    const isStepValid = await form.trigger(currentFields as Array<keyof FormValues>);
    return isStepValid;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep(currentStep);
    if (isStepValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={5}
          completedSteps={completedSteps}
        />

        <FormSections form={form} currentStep={currentStep} />

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="button-gradient text-white py-6 text-lg font-semibold"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer ma demande d'inscription"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}