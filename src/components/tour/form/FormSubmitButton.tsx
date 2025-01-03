import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import type { TourFormValues } from "./types";

interface FormSubmitButtonProps {
  form: UseFormReturn<TourFormValues>;
}

export function FormSubmitButton({ form }: FormSubmitButtonProps) {
  const allTermsAccepted = form.watch(['terms_accepted', 'customs_declaration'])
    .every(value => value === true);

  return (
    <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={!form.formState.isValid || !allTermsAccepted}
      >
        <Truck className="mr-2 h-4 w-4" />
        Créer la tournée
      </Button>
    </div>
  );
}