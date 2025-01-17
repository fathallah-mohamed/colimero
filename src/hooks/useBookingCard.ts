import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BookingStatus } from "@/types/booking";

export function useBookingCard(
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void,
  onUpdate: () => Promise<void>
) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleEditSuccess = async () => {
    await onUpdate();
    setShowEditDialog(false);
    toast({
      title: "Réservation mise à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  return {
    showEditDialog,
    setShowEditDialog,
    showDetails,
    setShowDetails,
    handleEditSuccess,
  };
}