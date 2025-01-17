import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCardDetails } from "./BookingCardDetails";
import { TourDetails } from "./TourDetails";

interface BookingCardContentProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  booking: any;
  tours?: any;
}

export function BookingCardContent({
  showDetails,
  setShowDetails,
  booking,
  tours
}: BookingCardContentProps) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? (
          <>
            Masquer les détails
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Voir tous les détails
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>

      {showDetails && (
        <div className="space-y-6">
          {tours && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Détails de la tournée</h4>
              <TourDetails tour={tours} />
            </div>
          )}
          <BookingCardDetails booking={booking} />
        </div>
      )}
    </>
  );
}