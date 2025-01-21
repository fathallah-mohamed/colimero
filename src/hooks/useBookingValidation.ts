import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/types/booking";
import { toast } from "@/components/ui/use-toast";

export function useBookingValidation(form: UseFormReturn<BookingFormData>) {
  const validateStep = async (step: number): Promise<boolean> => {
    const fields = {
      1: ["sender_name", "sender_phone"],
      2: ["recipient_name", "recipient_phone", "recipient_address", "recipient_city"],
      3: ["item_type", "weight", "content_types"]
    };

    if (step < 4) {
      const currentFields = fields[step as keyof typeof fields];
      const isValid = await form.trigger(currentFields as Array<keyof BookingFormData>);
      
      if (!isValid) {
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