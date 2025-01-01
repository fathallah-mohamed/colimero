import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingFormData } from "@/types/booking";

export function useBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values: BookingFormData) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
        });
        navigate("/connexion");
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        ...values,
        user_id: user.id,
        status: values.status as BookingStatus,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre réservation a été enregistrée",
      });
      navigate("/mes-reservations");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement de votre réservation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
}