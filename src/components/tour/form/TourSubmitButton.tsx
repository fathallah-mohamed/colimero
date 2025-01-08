import { Button } from "@/components/ui/button";
import { Truck, Loader2 } from "lucide-react";

interface TourSubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
}

export function TourSubmitButton({ isSubmitting, isValid }: TourSubmitButtonProps) {
  return (
    <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          <>
            <Truck className="mr-2 h-4 w-4" />
            Créer la tournée
          </>
        )}
      </Button>
    </div>
  );
}