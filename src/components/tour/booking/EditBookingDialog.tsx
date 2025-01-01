import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingPhotoUpload } from "@/components/booking/BookingPhotoUpload";
import { BookingWeightSelector } from "@/components/booking/BookingWeightSelector";
import { BookingContentTypes } from "@/components/booking/BookingContentTypes";
import { BookingSpecialItems } from "@/components/booking/BookingSpecialItems";

const contentTypes = [
  "Vêtements", "Chaussures", "Produits alimentaires", "Electronique",
  "Livres", "Jouets", "Cosmétiques", "Médicaments", "Documents", "Accessoires"
];

const specialItems = [
  { name: "Vélo", price: 50, icon: "bike" },
  { name: "Trottinette", price: 30, icon: "scooter" },
  { name: "Ordinateur portable", price: 20, icon: "laptop" },
  { name: "Smartphone", price: 15, icon: "smartphone" },
  { name: "Télévision", price: 40, icon: "tv" },
  { name: "Colis volumineux", price: 25, icon: "package" }
];

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

  const handleWeightChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      weight: Math.min(Math.max(prev.weight + (increment ? 1 : -1), 5), 30)
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
    setFormData(prev => {
      const newSelectedItems = prev.special_items.includes(item)
        ? prev.special_items.filter(i => i !== item)
        : [...prev.special_items, item];
      
      if (!prev.special_items.includes(item)) {
        setItemQuantities(prev => ({ ...prev, [item]: 1 }));
      }
      
      return {
        ...prev,
        special_items: newSelectedItems
      };
    });
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + (increment ? 1 : -1))
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)]
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Préparer les special_items avec leurs quantités
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
          <div className="space-y-4">
            <h3 className="font-medium">Informations de l'expéditeur</h3>
            <div className="grid gap-4">
              <div>
                <Label>Nom de l'expéditeur</Label>
                <Input
                  value={formData.sender_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Téléphone de l'expéditeur</Label>
                <Input
                  value={formData.sender_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender_phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Informations du destinataire</h3>
            <div className="grid gap-4">
              <div>
                <Label>Nom du destinataire</Label>
                <Input
                  value={formData.recipient_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Téléphone du destinataire</Label>
                <Input
                  value={formData.recipient_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient_phone: e.target.value }))}
                />
              </div>
              <div>
                <Label>Adresse de livraison</Label>
                <Input
                  value={formData.recipient_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient_address: e.target.value }))}
                />
              </div>
              <div>
                <Label>Ville de livraison</Label>
                <Input
                  value={formData.delivery_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_city: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <BookingWeightSelector
            weight={formData.weight}
            onWeightChange={handleWeightChange}
          />

          <BookingContentTypes
            selectedTypes={formData.content_types}
            onTypeToggle={handleContentTypeToggle}
            contentTypes={contentTypes}
          />

          <BookingSpecialItems
            selectedItems={formData.special_items}
            onItemToggle={handleSpecialItemToggle}
            specialItems={specialItems}
            itemQuantities={itemQuantities}
            onQuantityChange={handleQuantityChange}
          />

          <BookingPhotoUpload
            photos={formData.photos}
            onPhotoUpload={handlePhotoUpload}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
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