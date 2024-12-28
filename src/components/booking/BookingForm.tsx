import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess, onCancel }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    weight: "",
    itemType: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase.from("bookings").insert({
        tour_id: tourId,
        user_id: user.id,
        pickup_city: pickupCity,
        weight: Number(formData.weight),
        item_type: formData.itemType,
        recipient_name: formData.recipientName,
        recipient_address: formData.recipientAddress,
        recipient_phone: formData.recipientPhone,
        status: "pending",
        tracking_number: `COL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });

      if (error) throw error;

      toast({
        title: "Réservation effectuée",
        description: "Votre réservation a été enregistrée avec succès",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="weight">Poids (kg)</Label>
        <Input
          id="weight"
          type="number"
          required
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="itemType">Type d'objet</Label>
        <Input
          id="itemType"
          required
          value={formData.itemType}
          onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="recipientName">Nom du destinataire</Label>
        <Input
          id="recipientName"
          required
          value={formData.recipientName}
          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="recipientAddress">Adresse du destinataire</Label>
        <Textarea
          id="recipientAddress"
          required
          value={formData.recipientAddress}
          onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="recipientPhone">Téléphone du destinataire</Label>
        <Input
          id="recipientPhone"
          type="tel"
          required
          value={formData.recipientPhone}
          onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Réserver"}
        </Button>
      </div>
    </form>
  );
}