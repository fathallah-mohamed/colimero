import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookingFormData } from "@/components/booking/form/schema";

export function useBookingCreation(tourId: number, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createBooking = async (formData: BookingFormData) => {
    try {
      setIsLoading(true);
      console.log('Starting booking creation process...', formData);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error("Erreur de session. Veuillez vous reconnecter.");
      }

      if (!session) {
        console.log('No active session found');
        navigate('/connexion');
        return;
      }

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
        console.error('Booking creation error:', error);
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

      // Récupérer les détails de la réservation créée
      const { data: bookingDetails, error: bookingError } = await supabase
        .from('bookings')
        .select('tracking_number')
        .eq('id', data)
        .single();

      if (bookingError) {
        throw bookingError;
      }

      console.log('Booking created successfully:', bookingDetails);
      return bookingDetails;

    } catch (error: any) {
      console.error("Error in createBooking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation.",
      });
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