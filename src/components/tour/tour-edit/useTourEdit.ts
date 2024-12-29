import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourFormData } from "./TourValidationSchema";

export function useTourEdit(tour: any, onComplete: () => void) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: TourFormData) => {
    if (!tour) return;

    setLoading(true);
    try {
      const departureDate = new Date(values.departure_date);

      // Vérifier que toutes les dates de collecte sont antérieures à la date de départ
      const hasInvalidDates = values.route.some(point => {
        const collectionDate = new Date(point.collection_date);
        return collectionDate > departureDate;
      });

      if (hasInvalidDates) {
        throw new Error("Les dates de collecte doivent être antérieures à la date de départ");
      }

      if (values.remaining_capacity > values.total_capacity) {
        throw new Error("La capacité restante ne peut pas être supérieure à la capacité totale");
      }

      const { error } = await supabase
        .from('tours')
        .update({
          total_capacity: values.total_capacity,
          remaining_capacity: values.remaining_capacity,
          type: values.type,
          departure_date: departureDate.toISOString(),
          route: values.route,
          departure_country: values.departure_country,
          destination_country: values.destination_country,
          terms_accepted: values.terms_accepted,
          customs_declaration: values.customs_declaration
        })
        .eq('id', tour.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La tournée a été mise à jour",
      });
      onComplete();
    } catch (error: any) {
      console.error('Error updating tour:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la tournée. Vérifiez les données saisies.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
}