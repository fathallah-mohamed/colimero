import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingFormFields } from "./edit-booking/BookingFormFields";
import { ContentTypesSection } from "./edit-booking/ContentTypesSection";
import { SpecialItemsSection } from "./edit-booking/SpecialItemsSection";
import { useBookingEdit } from "@/hooks/useBookingEdit";

interface EditBookingDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function EditBookingDialog({ booking, open, onOpenChange, onSuccess }: EditBookingDialogProps) {
  const [formData, setFormData] = useState({
    sender_name: booking?.sender_name || "",
    sender_phone: booking?.sender_phone || "",
    recipient_name: booking?.recipient_name || "",
    recipient_phone: booking?.recipient_phone || "",
    recipient_address: booking?.recipient_address || "",
    delivery_city: booking?.delivery_city || "",
    weight: booking?.weight || 5,
    content_types: booking?.content_types || [],
    special_items: booking?.special_items?.map((item: any) => item.name) || [],
    photos: booking?.photos || [],
  });

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    booking?.special_items?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.name] = item.quantity || 1;
      return acc;
    }, {}) || {}
  );

  const { isSubmitting, updateBooking } = useBookingEdit(booking.id, onSuccess);

  const handleFieldChange = (field: string, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (item: string, quantity: number) => {
    console.log(`Updating quantity for ${item} to:`, quantity);
    setItemQuantities((prev) => ({ ...prev, [item]: quantity }));
  };

  const handleSubmit = async () => {
    const success = await updateBooking(formData, itemQuantities);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <BookingFormFields 
            formData={formData}
            onChange={handleFieldChange}
          />

          <ContentTypesSection
            contentTypes={formData.content_types}
            onChange={(types) => handleFieldChange("content_types", types)}
          />

          <SpecialItemsSection
            specialItems={formData.special_items}
            itemQuantities={itemQuantities}
            onSpecialItemChange={(items) => handleFieldChange("special_items", items)}
            onQuantityChange={handleQuantityChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}