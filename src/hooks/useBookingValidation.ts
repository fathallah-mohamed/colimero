import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/components/booking/form/schema";
import { toast } from "@/components/ui/use-toast";

interface StepFields {
  [key: number]: Array<keyof BookingFormData>;
}

export function useBookingValidation(form: UseFormReturn<BookingFormData>) {
  const stepFields: StepFields = {
    1: ["sender_name", "sender_phone"],
    2: ["recipient_name", "recipient_phone", "recipient_address", "delivery_city"],
    3: ["item_type", "weight", "content_types"],
    4: ["terms_accepted", "customs_declaration"]
  };

  const validateStep = async (step: number): Promise<boolean> => {
    console.log(`Validating step ${step}`);
    
    if (step < 1 || step > 4) {
      console.error(`Invalid step number: ${step}`);
      return false;
    }

    const currentFields = stepFields[step];
    if (!currentFields) {
      console.error(`No fields defined for step ${step}`);
      return false;
    }

    const isValid = await form.trigger(currentFields);
    
    if (!isValid) {
      console.log(`Validation failed for step ${step}`);
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
    }

    return isValid;
  };

  return {
    validateStep
  };
}