import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BookingFormData } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const createBooking = async (formData: Partial<BookingFormData>) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          success: false, 
          message: "Vous devez être connecté pour effectuer une réservation" 
        };
      }

      // Upload photos if they exist and get their URLs
      let photoUrls: string[] = [];
      if (formData.photos && formData.photos.length > 0) {
        const uploadPromises = formData.photos.map(async (file: File) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;
          
          const { data, error: uploadError } = await supabase.storage
            .from('bookings')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('bookings')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        photoUrls = await Promise.all(uploadPromises);
      }

      const { data, error } = await supabase.rpc(
        'create_booking_with_capacity_update',
        {
          p_tour_id: tourId,
          p_user_id: user.id,
          p_weight: formData.weight,
          p_pickup_city: formData.pickup_city,
          p_delivery_city: formData.delivery_city,
          p_recipient_name: formData.recipient_name,
          p_recipient_address: formData.recipient_address,
          p_recipient_phone: formData.recipient_phone,
          p_sender_name: formData.sender_name,
          p_sender_phone: formData.sender_phone,
          p_item_type: formData.item_type,
          p_special_items: formData.special_items,
          p_content_types: formData.content_types,
          p_photos: photoUrls
        }
      );

      if (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        if (error.message.includes('Insufficient capacity')) {
          return { 
            success: false, 
            message: "La capacité restante de la tournée est insuffisante pour votre colis" 
          };
        }
        return { 
          success: false, 
          message: error.message 
        };
      }

      // Récupérer le numéro de suivi de la réservation créée
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('tracking_number')
        .eq('id', data)
        .single();

      if (bookingError) {
        console.error('Erreur lors de la récupération du numéro de suivi:', bookingError);
        return {
          success: true,
          bookingId: data,
          tracking: 'N/A'
        };
      }

      return {
        success: true,
        bookingId: data,
        tracking: bookingData.tracking_number
      };

    } catch (error: any) {
      console.error('Erreur lors de la création de la réservation:', error);
      return { 
        success: false, 
        message: error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading
  };
}