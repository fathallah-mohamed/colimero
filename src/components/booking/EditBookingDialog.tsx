import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingFormFields } from "./edit-booking/BookingFormFields";
import { SpecialItemsSection } from "./edit-booking/SpecialItemsSection";
import { ContentTypesSection } from "./edit-booking/ContentTypesSection";

interface EditBookingDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBookingDialog({ booking, open, onOpenChange, onSuccess }: EditBookingDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (item: string, quantity: number) => {
    setItemQuantities((prev) => ({ ...prev, [item]: quantity }));
  };

  const handleSubmit = async () => {
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

        <div className="space-y-6 py-4">
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
        </div>

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
      </DialogContent>
    </Dialog>
  );
}