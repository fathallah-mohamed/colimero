import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { SenderInfo } from "./form/SenderInfo";
import { RecipientInfo } from "./form/RecipientInfo";
import { BookingCommitments } from "./form/BookingCommitments";
import { useConsents } from "@/hooks/useConsents";
import type { BookingFormData } from "@/types/booking";

const contentTypes = [
  "Vêtements",
  "Chaussures",
  "Produits alimentaires",
  "Electronique",
  "Livres",
  "Jouets",
  "Cosmétiques",
  "Médicaments",
  "Documents",
  "Accessoires"
];

const specialItems = [
  { name: "Vélo", price: 50, icon: "bike" },
  { name: "Trottinette", price: 30, icon: "scooter" },
  { name: "Ordinateur portable", price: 20, icon: "laptop" },
  { name: "Smartphone", price: 15, icon: "smartphone" },
  { name: "Télévision", price: 40, icon: "tv" },
  { name: "Colis volumineux", price: 25, icon: "package" }
];

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  destinationCountry: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ 
  tourId, 
  pickupCity, 
  destinationCountry,
  onSuccess, 
  onCancel 
}: BookingFormProps) {
  const { toast } = useToast();
  const { consentTypes, userConsents } = useConsents();
  const [isLoading, setIsLoading] = useState(false);
  const [weight, setWeight] = useState(5);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [pricePerKg, setPricePerKg] = useState<number>(0);
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    deliveryCity: ""
  });
  const [hasExistingBooking, setHasExistingBooking] = useState(false);

  useEffect(() => {
    const fetchCarrierPrice = async () => {
      try {
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('carrier_id')
          .eq('id', tourId)
          .single();

        if (tourError) throw tourError;

        const { data: capacityData, error: capacityError } = await supabase
          .from('carrier_capacities')
          .select('price_per_kg')
          .eq('carrier_id', tourData.carrier_id)
          .single();

        if (capacityError) throw capacityError;

        setPricePerKg(capacityData.price_per_kg);
      } catch (error) {
        console.error('Error fetching carrier price:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer le prix du transporteur",
        });
      }
    };

    const checkExistingBooking = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: existingBooking, error } = await supabase
          .from('bookings')
          .select('id')
          .eq('tour_id', tourId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing booking:', error);
          return;
        }

        setHasExistingBooking(!!existingBooking);
      } catch (error) {
        console.error('Error checking existing booking:', error);
      }
    };

    fetchCarrierPrice();
    checkExistingBooking();
  }, [tourId, toast]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (clientError) throw clientError;

        if (clientData) {
          const fullName = `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
          setFormData(prev => ({
            ...prev,
            senderName: fullName,
            senderPhone: clientData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newWeight, 5), 30);
    });
  };

  const handleContentTypeToggle = (type: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSelectedSpecialItems(prev => {
      const newItems = prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item];
      
      if (!prev.includes(item)) {
        setItemQuantities(prev => ({
          ...prev,
          [item]: 1
        }));
      }
      
      return newItems;
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
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const calculateTotalPrice = () => {
    const weightPrice = weight * pricePerKg;
    const specialItemsPrice = selectedSpecialItems.reduce((total, item) => {
      const itemPrice = specialItems.find(i => i.name === item)?.price || 0;
      const quantity = itemQuantities[item] || 1;
      return total + (itemPrice * quantity);
    }, 0);

    return weightPrice + specialItemsPrice;
  };

  const areConsentsValid = () => {
    if (!consentTypes || !userConsents) return false;
    
    return consentTypes
      .filter(type => type.required)
      .every(type => 
        userConsents.some(
          consent => 
            consent.consent_type_id === type.id && 
            consent.accepted
        )
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasExistingBooking) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation pour cette tournée",
      });
      return;
    }

    if (!areConsentsValid()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter tous les consentements requis",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const uploadedPhotos = [];
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('bookings')
          .upload(`${user.id}/${fileName}`, photo);
        
        if (!uploadError) {
          uploadedPhotos.push(fileName);
        }
      }

      const specialItemsWithQuantities = selectedSpecialItems.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      const bookingData: BookingFormData = {
        tour_id: tourId,
        user_id: user.id,
        pickup_city: pickupCity,
        weight: weight,
        content_types: selectedContentTypes,
        special_items: specialItemsWithQuantities,
        photos: uploadedPhotos,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        recipient_name: formData.recipientName,
        recipient_phone: formData.recipientPhone,
        recipient_address: formData.recipientAddress,
        delivery_city: formData.deliveryCity,
        status: "pending",
        tracking_number: `COL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        item_type: selectedContentTypes[0] || "general",
        customs_declaration: true,
        terms_accepted: true
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

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

  if (hasExistingBooking) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-600 font-medium">
          Vous avez déjà une réservation pour cette tournée
        </p>
        <Button onClick={onCancel} variant="outline">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Détails du colis</h2>
        <p className="text-sm text-gray-500 text-center">
          Remplissez les informations de votre colis
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600">Prix au kilo: {pricePerKg}€</p>
          </div>

          <BookingWeightSelector 
            weight={weight}
            onWeightChange={handleWeightChange}
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
            onPhotoUpload={handlePhotoUpload}
          />

          <SenderInfo 
            formData={formData}
            setFormData={setFormData}
          />

          <RecipientInfo 
            formData={formData}
            setFormData={setFormData}
            destinationCountry={destinationCountry}
          />

          <BookingCommitments />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-400 hover:bg-blue-500"
        disabled={isLoading || !areConsentsValid()}
      >
        Confirmer la réservation ({calculateTotalPrice().toFixed(2)}€)
      </Button>
    </form>
  );
}
