import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/components/booking/form/schema";
import { toast } from "@/components/ui/use-toast";

export function useBookingValidation(form: UseFormReturn<BookingFormData>) {
  const validateStep = async (currentStep: number) => {
    console.log(`Validating step ${currentStep} with form values:`, form.getValues());
    
    const fields = {
      1: ["sender_name", "sender_phone"],
      2: ["recipient_name", "recipient_phone", "recipient_address", "delivery_city"],
      3: ["pickup_city", "item_type", "weight", "content_types"],
      4: ["terms_accepted", "customs_declaration"]
    };

    if (currentStep < 5) {
      const currentFields = fields[currentStep as keyof typeof fields];
      console.log(`Validating fields for step ${currentStep}:`, currentFields);
      
      const isValid = await form.trigger(currentFields as Array<keyof BookingFormData>);
      
      if (!isValid) {
        console.log('Form errors:', form.formState.errors);
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs obligatoires.",
        });
      }
      
      return isValid;
    }
    return true;
  };

  return {
    validateStep
  };
}