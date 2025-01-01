import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingFormFields } from "./BookingFormFields";
import { ContentTypesSection } from "./ContentTypesSection";
import { SpecialItemsSection } from "./SpecialItemsSection";

interface EditBookingFormProps {
  booking: any;
  onSubmit: (formData: any, itemQuantities: Record<string, number>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EditBookingForm({ booking, onSubmit, onCancel, isSubmitting }: EditBookingFormProps) {
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
    await onSubmit(formData, itemQuantities);
  };

  return (
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
        <Button variant="outline" onClick={onCancel}>
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
  );
}