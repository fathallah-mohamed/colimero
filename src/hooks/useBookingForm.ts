import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingFormData, BookingStatus } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess: () => void) {
  const { toast } = useToast();
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
        const { data: tourData } = await supabase
          .from('tours')
          .select('carrier_id')
          .eq('id', tourId)
          .maybeSingle();

        if (!tourData) {
          throw new Error('Tour not found');
        }

        const { data: capacityData } = await supabase
          .from('carrier_capacities')
          .select('price_per_kg')
          .eq('carrier_id', tourData.carrier_id)
          .maybeSingle();

        if (capacityData) {
          setPricePerKg(capacityData.price_per_kg);
        }
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

        // Changed from .single() to .select() to handle multiple results
        const { data: existingBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('tour_id', tourId)
          .eq('user_id', user.id)
          .neq('status', 'cancelled');

        // If there are any active bookings, set hasExistingBooking to true
        setHasExistingBooking(existingBookings && existingBookings.length > 0);
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

        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle();

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
        pickup_city: formData.deliveryCity,
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
        status: "pending" as BookingStatus,
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

  return {
    isLoading,
    weight,
    setWeight,
    selectedContentTypes,
    setSelectedContentTypes,
    selectedSpecialItems,
    setSelectedSpecialItems,
    itemQuantities,
    setItemQuantities,
    photos,
    setPhotos,
    pricePerKg,
    formData,
    setFormData,
    hasExistingBooking,
    handleSubmit,
  };
}