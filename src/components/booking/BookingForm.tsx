import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import type { BookingFormData } from "@/types/booking";

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  destinationCountry: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({ tourId, pickupCity, destinationCountry, onSuccess, onCancel }: BookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [weight, setWeight] = useState(5);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [customsDeclaration, setCustomsDeclaration] = useState(false);

  const contentTypes = [
    "Vêtements",
    "Électronique",
    "Documents",
    "Alimentaire",
    "Cosmétiques",
    "Autres",
  ];

  const specialItems = [
    { name: "Fragile", price: 5, icon: "package" },
    { name: "Volumineux", price: 10, icon: "box" },
    { name: "Urgent", price: 15, icon: "zap" },
  ];

  const handleContentTypeToggle = (type: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSelectedSpecialItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + (increment ? 1 : -1)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter les conditions générales",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer une réservation",
      });
      setIsSubmitting(false);
      return;
    }

    const specialItemsWithQuantity = selectedSpecialItems.map(item => ({
      name: item,
      quantity: itemQuantities[item] || 1
    }));

    const bookingData: BookingFormData = {
      tour_id: tourId,
      user_id: user.id,
      pickup_city: pickupCity,
      delivery_city: formData.get("delivery_city") as string,
      weight,
      content_types: selectedContentTypes,
      special_items: specialItemsWithQuantity,
      photos,
      sender_name: formData.get("sender_name") as string,
      sender_phone: formData.get("sender_phone") as string,
      recipient_name: formData.get("recipient_name") as string,
      recipient_phone: formData.get("recipient_phone") as string,
      recipient_address: formData.get("recipient_address") as string,
      status: "pending",
      tracking_number: Math.random().toString(36).substring(2, 15),
      item_type: selectedContentTypes.join(", "),
      customs_declaration: customsDeclaration,
    };

    try {
      const { error } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Réservation confirmée !",
        description: "Votre demande a été enregistrée avec succès.",
      });

      // Redirection après un court délai pour montrer le message de succès
      setTimeout(() => {
        navigate("/mes-reservations");
      }, 2000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
      });
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-center">Réservation confirmée !</h2>
        <p className="text-gray-600 text-center">
          Votre demande a été enregistrée avec succès. Vous allez être redirigé vers vos réservations...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BookingWeightSelector 
        weight={weight} 
        onWeightChange={setWeight}
      />

      <BookingContentTypes
        selectedTypes={selectedContentTypes}
        onTypeToggle={handleContentTypeToggle}
        contentTypes={contentTypes}
      />

      <BookingSpecialItems
        selectedItems={selectedSpecialItems}
        onItemToggle={handleSpecialItemToggle}
        specialItems={specialItems}
        itemQuantities={itemQuantities}
        onQuantityChange={handleQuantityChange}
      />

      <BookingPhotoUpload 
        photos={photos}
        onPhotosChange={setPhotos}
      />

      <div className="space-y-4">
        <div>
          <Label htmlFor="sender_name">Nom de l'expéditeur</Label>
          <Input id="sender_name" name="sender_name" required />
        </div>
        <div>
          <Label htmlFor="sender_phone">Téléphone de l'expéditeur</Label>
          <Input id="sender_phone" name="sender_phone" required />
        </div>
        <div>
          <Label htmlFor="recipient_name">Nom du destinataire</Label>
          <Input id="recipient_name" name="recipient_name" required />
        </div>
        <div>
          <Label htmlFor="recipient_phone">Téléphone du destinataire</Label>
          <Input id="recipient_phone" name="recipient_phone" required />
        </div>
        <div>
          <Label htmlFor="recipient_address">Adresse du destinataire</Label>
          <Input id="recipient_address" name="recipient_address" required />
        </div>
        <div>
          <Label htmlFor="delivery_city">Ville de livraison</Label>
          <Input id="delivery_city" name="delivery_city" required />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            J'accepte les conditions générales
          </label>
        </div>

        {destinationCountry !== "FR" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="customs"
              checked={customsDeclaration}
              onCheckedChange={(checked) => setCustomsDeclaration(checked as boolean)}
            />
            <label
              htmlFor="customs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Je déclare que mon colis respecte les règles douanières
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Confirmer la réservation"}
        </Button>
      </div>
    </form>
  );
}
