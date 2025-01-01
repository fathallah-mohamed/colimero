import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditBookingForm } from "./edit-booking/EditBookingForm";

interface EditBookingDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBookingDialog({ booking, open, onOpenChange, onSuccess }: EditBookingDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any, itemQuantities: Record<string, number>) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", formData);

      const formattedSpecialItems = formData.special_items.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      const { error } = await supabase
        .from("bookings")
        .update({
          sender_name: formData.sender_name,
          sender_phone: formData.sender_phone,
          recipient_name: formData.recipient_name,
          recipient_phone: formData.recipient_phone,
          recipient_address: formData.recipient_address,
          delivery_city: formData.delivery_city,
          weight: formData.weight,
          content_types: formData.content_types,
          special_items: formattedSpecialItems,
          photos: formData.photos
        })
        .eq("id", booking.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La réservation a été mise à jour",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
        </DialogHeader>

        <EditBookingForm
          booking={booking}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}