import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingFormData, BookingFormState, BookingStatus } from "@/types/booking";

const generateTrackingNumber = () => {
  return 'TN' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export function useBookingForm(tourId: number, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<BookingFormState>({
    weight: 5,
    selectedContentTypes: [],
    selectedSpecialItems: [],
    itemQuantities: {},
    photos: [],
    formData: {
      senderName: '',
      senderPhone: '',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
      deliveryCity: '',
    },
  });
  const [pricePerKg] = useState(10);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: Omit<BookingFormData, 'user_id' | 'tracking_number' | 'status'>) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
        });
        navigate("/connexion");
        return;
      }

      const bookingData: BookingFormData = {
        ...values,
        user_id: user.id,
        tracking_number: generateTrackingNumber(),
        status: 'pending' as BookingStatus,
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre réservation a été enregistrée",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réservation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    pricePerKg,
    ...state,
    setState,
    handleSubmit,
  };
}