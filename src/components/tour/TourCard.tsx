import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, ChevronUp, Hash, ArrowRight } from "lucide-react";
import { TourCapacityInfo } from "./TourCapacityInfo";
import { generateTourPDF } from "./tour-card/PDFGenerator";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "../booking/BookingCard";
import { cn } from "@/lib/utils";
import { TourStatusBadge } from "./TourStatusBadge";
import { Badge } from "@/components/ui/badge";
import { TourTimelineDisplay } from "./shared/TourTimelineDisplay";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus } from "@/types/tour";
import type { BookingStatus } from "@/types/booking";
import { TourEditDialog } from "./TourEditDialog";

interface TourCardProps {
  tour: Tour;
  isEven?: boolean;
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

const countryNames: { [key: string]: string } = {
  'FR': 'France',
  'TN': 'Tunisie',
  'DZ': 'Algérie',
  'MA': 'Maroc'
};

const countryFlags: { [key: string]: string } = {
  'FR': '🇫🇷',
  'TN': '🇹🇳',
  'DZ': '🇩🇿',
  'MA': '🇲🇦'
};

export function TourCard({ 
  tour,
  isEven = false,
  onStatusChange,
  onUpdate
}: TourCardProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const handleTourStatusChange = async (tourId: number, newStatus: TourStatus) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (error) throw error;

      if (onUpdate) {
        await onUpdate();
      }

      toast({
        title: "Statut mis à jour",
        description: `La tournée est maintenant en statut "${newStatus}"`,
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleEditComplete = async () => {
    setIsEditDialogOpen(false);
    if (onUpdate) {
      await onUpdate();
    }
    toast({
      title: "Tournée mise à jour",
      description: "Les modifications ont été enregistrées avec succès",
    });
  };

  const hasBookings = tour.bookings && tour.bookings.length > 0;

  return (
    <Card className={cn(
      "p-6",
      isEven ? "bg-secondary hover:bg-secondary/90" : "bg-muted hover:bg-muted/90",
      "transition-colors duration-200"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Tournée du {new Date(tour.departure_date).toLocaleDateString()}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="flex items-center">
              <span className="text-xl mr-1">{countryFlags[tour.departure_country]}</span>
              {countryNames[tour.departure_country]}
            </span>
            <ArrowRight className="h-5 w-5 text-primary mx-1 stroke-2" />
            <span className="flex items-center">
              <span className="text-xl mr-1">{countryFlags[tour.destination_country]}</span>
              {countryNames[tour.destination_country]}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Hash className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-primary">
                {tour.tour_number || "Numéro non défini"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <TourStatusBadge status={tour.status} />
            <Badge variant={tour.type === "public" ? "default" : "secondary"}>
              {tour.type === "public" ? "Publique" : "Privée"}
            </Badge>
          </div>
        </div>
        
        {hasBookings && (
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
        )}
      </div>

      <TourTimelineDisplay
        status={tour.status}
        tourId={tour.id}
        onStatusChange={handleTourStatusChange}
        canEdit={true}
        onEdit={() => setIsEditDialogOpen(true)}
      />

      <TourCapacityInfo
        totalCapacity={tour.total_capacity}
        remainingCapacity={tour.remaining_capacity}
        bookingsCount={tour.bookings?.length || 0}
      />

      {hasBookings && (
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowBookings(!showBookings)}
          >
            {showBookings ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Masquer les réservations
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Afficher les réservations ({tour.bookings.length})
              </>
            )}
          </Button>
        </div>
      )}

      {showBookings && hasBookings && (
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
      )}

      <TourEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        tour={tour}
        onComplete={handleEditComplete}
      />
    </Card>
  );
}
