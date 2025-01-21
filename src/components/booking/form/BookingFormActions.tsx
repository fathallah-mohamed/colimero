import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface BookingFormActionsProps {
  currentStep: number;
  isLoading: boolean;
  isUploading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function BookingFormActions({
  currentStep,
  isLoading,
  isUploading,
  onPrevious,
  onNext
}: BookingFormActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isLoading || isUploading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Précédent
      </Button>

      {currentStep < 4 ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading || isUploading}
          className="flex items-center gap-2"
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="flex items-center gap-2"
        >
          {isLoading || isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Création...
            </>
          ) : (
            "Créer la réservation"
          )}
        </Button>
      )}
    </div>
  );
}