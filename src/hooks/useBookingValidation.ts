import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/components/booking/form/schema";
import { toast } from "@/components/ui/use-toast";

export function useBookingValidation(form: UseFormReturn<BookingFormData>) {
  const validateStep = async (currentStep: number) => {
    console.log(`Validating step ${currentStep}`);
    
    const fields = {
      1: ["sender_name", "sender_phone"],
      2: ["recipient_name", "recipient_phone", "recipient_address", "delivery_city"],
      3: ["item_type", "weight", "content_types"],
      4: ["terms_accepted", "customs_declaration"]
    };

    if (currentStep < 5) {
      const currentFields = fields[currentStep as keyof typeof fields];
      const isValid = await form.trigger(currentFields as Array<keyof BookingFormData>);
      
      if (!isValid) {
        console.log(`Validation failed for step ${currentStep}`);
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