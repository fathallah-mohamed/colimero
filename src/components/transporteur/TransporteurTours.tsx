import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking/BookingForm";
import { TourCard } from "./TourCard";
import { Tour } from "@/types/tour";
import { Loader2 } from "lucide-react";

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
}

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Record<number, { pickupCity: string }>>({});

  const handleBookingClick = (tourId: number, pickupCity: string) => {
    setCurrentTourId(tourId);
    setSelectedPoints(prev => ({ ...prev, [tourId]: { pickupCity } }));
    setIsBookingFormOpen(true);
  };

  const currentTour = tours.find(tour => tour.id === currentTourId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {type === "public" 
            ? "Aucune tournée publique disponible pour le moment."
            : "Aucune tournée privée disponible pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour}
            onBookingClick={handleBookingClick}
          />
        ))}
      </div>

      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          {currentTourId && selectedPoints[currentTourId] && currentTour && (
            <div className="h-full overflow-hidden">
              <BookingForm
                tourId={currentTourId}
                pickupCity={selectedPoints[currentTourId].pickupCity}
                destinationCountry={currentTour.destination_country}
                onSuccess={() => setIsBookingFormOpen(false)}
                onCancel={() => setIsBookingFormOpen(false)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
