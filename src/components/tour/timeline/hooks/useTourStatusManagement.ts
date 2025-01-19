import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TourStatus } from "@/types/tour";

interface UseTourStatusManagementProps {
  tourId: number;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
}

export function useTourStatusManagement({ tourId, onStatusChange }: UseTourStatusManagementProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPendingBookingsDialog, setShowPendingBookingsDialog] = useState(false);
  const { toast } = useToast();

  const checkPendingBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('tour_id', tourId)
        .eq('status', 'pending');

      if (error) throw error;

      if (bookings && bookings.length > 0) {
        setShowPendingBookingsDialog(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking pending bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier les réservations en attente",
      });
      return true;
    }
  };

  const checkUncollectedBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('tour_id', tourId)
        .not('status', 'in', ['collected', 'cancelled']);

      if (error) throw error;

      if (bookings && bookings.length > 0) {
        toast({
          variant: "destructive",
          title: "Action impossible",
          description: "Toutes les réservations doivent être ramassées ou annulées avant de démarrer le transit",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking uncollected bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier l'état des réservations",
      });
      return true;
    }
  };

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée");
    }
    setShowCancelDialog(false);
  };

  const handleStartCollection = async () => {
    const hasPendingBookings = await checkPendingBookings();
    if (!hasPendingBookings && onStatusChange) {
      await onStatusChange("Ramassage en cours");
    }
  };

  const handleStartTransit = async () => {
    const hasUncollectedBookings = await checkUncollectedBookings();
    if (!hasUncollectedBookings && onStatusChange) {
      await onStatusChange("En transit");
    }
  };

  const handleStartDelivery = async () => {
    if (onStatusChange) {
      await onStatusChange("Livraison en cours");
    }
  };

  const handleComplete = async () => {
    if (onStatusChange) {
      await onStatusChange("Terminée");
    }
  };

  return {
    showCancelDialog,
    setShowCancelDialog,
    showPendingBookingsDialog,
    setShowPendingBookingsDialog,
    handleCancel,
    handleStartCollection,
    handleStartTransit,
    handleStartDelivery,
    handleComplete
  };
}