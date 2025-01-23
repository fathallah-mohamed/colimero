import { useState, useEffect } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

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
  const [localTour, setLocalTour] = useState(tour);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // S'abonner aux changements en temps réel pour cette tournée
    const channel = supabase
      .channel(`tour_${tour.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tours',
          filter: `id=eq.${tour.id}`
        },
        (payload) => {
          console.log('Tour updated:', payload);
          setLocalTour(payload.new as Tour);
          // Invalider le cache pour forcer le rechargement des données
          queryClient.invalidateQueries({ queryKey: ['tours'] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tour.id, queryClient]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const success = await generateTourPDF(localTour);
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

  const hasBookings = localTour.bookings && localTour.bookings.length > 0;

  return (
    <Card className={cn(
      "p-6",
      isEven ? "bg-secondary hover:bg-secondary/90" : "bg-muted hover:bg-muted/90",
      "transition-colors duration-200"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Tournée du {new Date(localTour.departure_date).toLocaleDateString()}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="flex items-center">
              <span className="text-xl mr-1">{countryFlags[localTour.departure_country]}</span>
              {countryNames[localTour.departure_country]}
            </span>
            <ArrowRight className="h-5 w-5 text-primary mx-1 stroke-2" />
            <span className="flex items-center">
              <span className="text-xl mr-1">{countryFlags[localTour.destination_country]}</span>
              {countryNames[localTour.destination_country]}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Hash className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-primary">
                {localTour.tour_number || "Numéro non défini"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <TourStatusBadge status={localTour.status} />
            <Badge variant={localTour.type === "public" ? "default" : "secondary"}>
              {localTour.type === "public" ? "Publique" : "Privée"}
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
        status={localTour.status}
        tourId={localTour.id}
        onStatusChange={handleTourStatusChange}
        canEdit={true}
        onEdit={() => setIsEditDialogOpen(true)}
      />

      <TourCapacityInfo
        totalCapacity={localTour.total_capacity}
        remainingCapacity={localTour.remaining_capacity}
        bookingsCount={localTour.bookings?.length || 0}
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
                Afficher les réservations ({localTour.bookings.length})
              </>
            )}
          </Button>
        </div>
      )}

      {showBookings && hasBookings && (
        <div className="mt-6 space-y-4">
          {localTour.bookings?.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isCollecting={localTour.status === "Ramassage en cours"}
              onStatusChange={onStatusChange || (() => Promise.resolve())}
              onUpdate={onUpdate || (() => Promise.resolve())}
              tourStatus={localTour.status}
            />
          ))}
        </div>
      )}

      <TourEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        tour={localTour}
        onComplete={handleEditComplete}
      />
    </Card>
  );
}