import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "./schema";

export function useFormValidation(form: UseFormReturn<BookingFormData>) {
  const validateStep = async (currentStep: number) => {
    const fields = {
      1: ["sender_name", "sender_phone"],
      2: ["recipient_name", "recipient_phone", "recipient_address", "recipient_city"],
      3: ["item_type", "weight", "content_types"]
    };

    if (currentStep < 4) {
      const currentFields = fields[currentStep as keyof typeof fields];
      return await form.trigger(currentFields as Array<keyof BookingFormData>);
    }
    return true;
  };

  return {
    validateStep
  };
}