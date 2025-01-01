import { Button } from "@/components/ui/button";
import { BookingDetails } from "../details/BookingDetails";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface BookingCardDetailsProps {
  booking: any;
}

export function BookingCardDetails({ booking }: BookingCardDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails && <BookingDetails booking={booking} />}
      
      <div className="flex justify-center border-t pt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center justify-center gap-2 w-full max-w-md hover:bg-gray-50"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="h-4 w-4" />
          {showDetails ? (
            <>
              Masquer les détails de la réservation
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Voir tous les détails de la réservation
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
}