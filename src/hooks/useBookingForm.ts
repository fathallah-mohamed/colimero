import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BookingFormData } from "@/types/booking";

export function useBookingForm(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createBooking = async (formData: BookingFormData) => {
    try {
      setIsLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No session found");
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
          p_user_id: session.user.id,
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
        if (error.message.includes('Insufficient capacity')) {
          toast({
            variant: "destructive",
            title: "Capacité insuffisante",
            description: "La capacité restante de la tournée est insuffisante pour votre réservation.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la création de la réservation.",
          });
        }
        throw error;
      }

      toast({
        title: "Réservation créée",
        description: "Votre réservation a été créée avec succès.",
      });

      if (onSuccess) {
        onSuccess();
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading
  };
}