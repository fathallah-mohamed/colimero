import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { TourCapacityInfo } from "./TourCapacityInfo";
import { generateTourPDF } from "./tour-card/PDFGenerator";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "../booking/BookingCard";
import type { Tour } from "@/types/tour";
import type { BookingStatus } from "@/types/booking";

interface TourCardProps {
  tour: Tour;
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

export function TourCard({ 
  tour,
  onStatusChange,
  onUpdate
}: TourCardProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const success = await generateTourPDF(tour);
      if (success) {
        toast({
          title: "PDF généré avec succès",
          description: "Le fichier a été téléchargé",
        });
      } else {
        throw new Error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">
            Tournée du {new Date(tour.departure_date).toLocaleDateString()}
          </h3>
          <p className="text-sm text-gray-500">
            {tour.departure_country} → {tour.destination_country}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          {isGeneratingPDF ? "Génération..." : "Télécharger PDF"}
        </Button>
      </div>

      <TourCapacityInfo
        totalCapacity={tour.total_capacity}
        remainingCapacity={tour.remaining_capacity}
        bookingsCount={tour.bookings?.length || 0}
      />

      <div className="mt-6 space-y-4">
        {tour.bookings?.map((booking: any) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isCollecting={tour.status === "Ramassage en cours"}
            onStatusChange={onStatusChange || (() => Promise.resolve())}
            onUpdate={onUpdate || (() => Promise.resolve())}
            tourStatus={tour.status}
          />
        ))}
      </div>
    </Card>
  );
}