import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, type FormValues } from "./FormSchema";
import { FormSections } from "./FormSections";
import { useCarrierRegistration } from "@/hooks/useCarrierRegistration";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = (currentStep / 5) * 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-6">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 -mx-4 mb-6">
          <div className="flex items-center justify-between mb-2 text-sm font-medium">
            <span>Étape {currentStep} sur 5</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <FormSections form={form} currentStep={currentStep} />

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer ma demande
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Spacer to prevent content from being hidden behind fixed buttons */}
        <div className="h-20" />
      </form>
    </Form>
  );
}