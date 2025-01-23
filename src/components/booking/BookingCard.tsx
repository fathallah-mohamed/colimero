import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info, FileDown } from "lucide-react";
import { EditBookingDialog } from "./EditBookingDialog";
import { BookingActions } from "./card/BookingActions";
import { BookingHeaderSection } from "./header/BookingHeaderSection";
import { BookingDetailsContent } from "./details/BookingDetailsContent";
import type { Booking, BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { generateDeliverySlip } from "@/utils/generateDeliverySlip";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface BookingCardProps {
  booking: Booking;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => Promise<void>;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange, 
  onUpdate, 
  tourStatus 
}: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localBooking, setLocalBooking] = useState(booking);
  const { toast } = useToast();
  const { userType } = useProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    // S'abonner aux changements en temps réel pour cette réservation
    const channel = supabase
      .channel(`booking_${booking.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${booking.id}`
        },
        (payload) => {
          console.log('Booking updated:', payload);
          setLocalBooking(payload.new as Booking);
          // Invalider le cache pour forcer le rechargement des données
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          queryClient.invalidateQueries({ queryKey: ['tours'] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking.id, queryClient]);

  console.log("BookingCard - Booking status:", localBooking.status);
  console.log("BookingCard - Tour status:", tourStatus);
  console.log("BookingCard - User type:", userType);

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", localBooking.id);
    setShowEditDialog(true);
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log("Changing booking status to:", newStatus);
      await onStatusChange(localBooking.id, newStatus);
      await onUpdate();
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation.",
      });
    }
  };

  const handleDownloadDeliverySlip = () => {
    try {
      generateDeliverySlip(localBooking);
      toast({
        title: "Bon de livraison généré",
        description: "Le bon de livraison a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error("Error generating delivery slip:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le bon de livraison.",
      });
    }
  };

  return (
    <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <BookingHeaderSection booking={localBooking} />
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadDeliverySlip}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FileDown className="h-4 w-4" />
            Télécharger le bon de livraison
          </Button>

          <BookingActions
            bookingId={localBooking.id}
            status={localBooking.status}
            tourStatus={tourStatus || ''}
            onStatusChange={handleStatusChange}
            onUpdate={onUpdate}
            onEdit={handleEdit}
            userType={userType || 'client'}
          />
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Info className="h-4 w-4" />
              {isExpanded ? "Masquer les détails" : "Voir les détails"}
            </Button>
          </CollapsibleTrigger>

          <BookingDetailsContent booking={localBooking} isExpanded={isExpanded} />
        </Collapsible>
      </div>

      <EditBookingDialog
        booking={localBooking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </Card>
  );
}