import { useState } from "react";
import { TourStatus } from "@/types/tour";
import { supabase } from "@/integrations/supabase/client";
import type { BookingStatus } from "@/types/booking";

interface UseTourStatusManagementProps {
  tourId: number;
  onStatusChange?: (newStatus: TourStatus) => void;
  onBookingStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
}

export function useTourStatusManagement({ tourId, onStatusChange, onBookingStatusChange }: UseTourStatusManagementProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPendingBookingsDialog, setShowPendingBookingsDialog] = useState(false);
  const [showUncollectedBookingsDialog, setShowUncollectedBookingsDialog] = useState(false);

  const checkPendingBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('tour_id', tourId)
      .eq('status', 'pending');

    if (error) throw error;
    return data.length > 0;
  };

  const checkUncollectedBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('tour_id', tourId)
      .not('status', 'in', '(collected,cancelled)');

    if (error) throw error;
    return data.length > 0;
  };

  const handleStartCollection = async () => {
    const hasPendingBookings = await checkPendingBookings();
    if (hasPendingBookings) {
      setShowPendingBookingsDialog(true);
      return;
    }
    await onStatusChange?.("Ramassage en cours");
  };

  const handleStartTransit = async () => {
    const hasUncollectedBookings = await checkUncollectedBookings();
    if (hasUncollectedBookings) {
      setShowUncollectedBookingsDialog(true);
      return;
    }
    await onStatusChange?.("En transit");
  };

  const handleStartDelivery = async () => {
    await onStatusChange?.("Livraison en cours");
  };

  const handleComplete = async () => {
    await onStatusChange?.("Terminée");
  };

  const handleCancel = async () => {
    await onStatusChange?.("Annulée");
    setShowCancelDialog(false);
  };

  return {
    showCancelDialog,
    setShowCancelDialog,
    showPendingBookingsDialog,
    setShowPendingBookingsDialog,
    showUncollectedBookingsDialog,
    setShowUncollectedBookingsDialog,
    handleCancel,
    handleStartCollection,
    handleStartTransit,
    handleStartDelivery,
    handleComplete
  };
}