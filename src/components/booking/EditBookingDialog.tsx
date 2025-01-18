import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookingEdit } from "@/hooks/useBookingEdit";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditBookingDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function EditBookingDialog({ booking, open, onOpenChange, onSuccess }: EditBookingDialogProps) {
  // Parse special_items if it's a string, otherwise use as is
  const parseSpecialItems = (items: any) => {
    if (!items) return [];
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch (e) {
        console.error('Error parsing special items:', e);
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
  };

  const [formData, setFormData] = useState({
    sender_name: booking?.sender_name || "",
    sender_phone: booking?.sender_phone || "",
    recipient_name: booking?.recipient_name || "",
    recipient_phone: booking?.recipient_phone || "",
    recipient_address: booking?.recipient_address || "",
    delivery_city: booking?.delivery_city || "",
    weight: booking?.weight || 5,
    content_types: booking?.content_types || [],
    special_items: parseSpecialItems(booking?.special_items).map((item: any) => 
      typeof item === 'string' ? item : item.name
    ),
  });

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    parseSpecialItems(booking?.special_items).reduce((acc: Record<string, number>, item: any) => {
      const itemName = typeof item === 'string' ? item : item.name;
      acc[itemName] = typeof item === 'string' ? 1 : (item.quantity || 1);
      return acc;
    }, {})
  );

  const { isSubmitting, updateBooking } = useBookingEdit(booking.id, onSuccess);

  const handleFieldChange = (field: string, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      weight: Math.min(Math.max(increment ? prev.weight + 1 : prev.weight - 1, 5), 30)
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      content_types: prev.content_types.includes(type)
        ? prev.content_types.filter(t => t !== type)
        : [...prev.content_types, type]
    }));
  };

  const handleSpecialItemToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      special_items: prev.special_items.includes(item)
        ? prev.special_items.filter(i => i !== item)
        : [...prev.special_items, item]
    }));
  };

  const handleQuantityChange = (item: string, increment: boolean) => {
    setItemQuantities(prev => ({
      ...prev,
      [item]: Math.max((prev[item] || 1) + (increment ? 1 : -1), 1)
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);
    console.log("Item quantities:", itemQuantities);
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
          <div className="space-y-4">
            <div>
              <Label>Nom de l'expéditeur</Label>
              <Input
                value={formData.sender_name}
                onChange={(e) => handleFieldChange("sender_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Téléphone de l'expéditeur</Label>
              <Input
                value={formData.sender_phone}
                onChange={(e) => handleFieldChange("sender_phone", e.target.value)}
              />
            </div>

            <div>
              <Label>Nom du destinataire</Label>
              <Input
                value={formData.recipient_name}
                onChange={(e) => handleFieldChange("recipient_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Téléphone du destinataire</Label>
              <Input
                value={formData.recipient_phone}
                onChange={(e) => handleFieldChange("recipient_phone", e.target.value)}
              />
            </div>

            <div>
              <Label>Adresse du destinataire</Label>
              <Input
                value={formData.recipient_address}
                onChange={(e) => handleFieldChange("recipient_address", e.target.value)}
              />
            </div>

            <div>
              <Label>Ville de livraison</Label>
              <Input
                value={formData.delivery_city}
                onChange={(e) => handleFieldChange("delivery_city", e.target.value)}
              />
            </div>
          </div>

          <BookingWeightSelector
            weight={formData.weight}
            onWeightChange={handleWeightChange}
          />

          <BookingContentTypes
            selectedTypes={formData.content_types}
            onTypeToggle={handleContentTypeToggle}
            contentTypes={[
              "Vêtements",
              "Chaussures",
              "Jouets",
              "Livres",
              "Cosmétiques",
              "Accessoires",
              "Electronique",
              "Produits alimentaires",
              "Médicaments",
              "Documents"
            ]}
          />

          <BookingSpecialItems
            selectedItems={formData.special_items}
            onItemToggle={handleSpecialItemToggle}
            specialItems={[
              { name: "Vélo", price: 50, icon: "bicycle" },
              { name: "Trottinette", price: 30, icon: "scooter" },
              { name: "Télévision", price: 80, icon: "tv" },
              { name: "Meuble", price: 100, icon: "cabinet" },
              { name: "Instrument de musique", price: 70, icon: "music" },
              { name: "Équipement sportif", price: 40, icon: "dumbbell" }
            ]}
            itemQuantities={itemQuantities}
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