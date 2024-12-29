import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { TourBasicInfo } from "./tour-edit/TourBasicInfo";
import { TourDates } from "./tour-edit/TourDates";
import { TourCollectionPoints } from "./tour-edit/TourCollectionPoints";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  total_capacity: z.string()
    .min(1, "La capacité totale est requise")
    .transform(val => Number(val))
    .refine(val => val > 0, "La capacité doit être supérieure à 0"),
  remaining_capacity: z.string()
    .min(1, "La capacité restante est requise")
    .transform(val => Number(val))
    .refine(val => val >= 0, "La capacité restante doit être positive ou nulle"),
  type: z.enum(["public", "private"], {
    required_error: "Le type de tournée est requis",
  }),
  departure_date: z.string()
    .min(1, "La date de départ est requise")
    .refine(val => !isNaN(new Date(val).getTime()), "Format de date invalide"),
  collection_date: z.string()
    .min(1, "La date de collecte est requise")
    .refine(val => !isNaN(new Date(val).getTime()), "Format de date invalide"),
  route: z.array(z.object({
    name: z.string().min(1, "Le nom de la ville est requis"),
    location: z.string().min(1, "L'adresse est requise"),
    time: z.string().min(1, "L'heure est requise"),
    type: z.literal("pickup")
  })).min(1, "Au moins un point de collecte est requis"),
});

interface TourEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tour: any;
  onComplete: () => void;
}

export function TourEditDialog({ isOpen, onClose, tour, onComplete }: TourEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_capacity: tour?.total_capacity?.toString() || "",
      remaining_capacity: tour?.remaining_capacity?.toString() || "",
      type: tour?.type || "public",
      departure_date: tour?.departure_date ? new Date(tour.departure_date).toISOString().split('T')[0] : "",
      collection_date: tour?.collection_date ? new Date(tour.collection_date).toISOString().split('T')[0] : "",
      route: Array.isArray(tour?.route) ? tour.route.map((stop: any) => ({
        name: stop.name || "",
        location: stop.location || "",
        time: stop.time || "08:00",
        type: stop.type || "pickup"
      })) : [],
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!tour) return;

    setLoading(true);
    try {
      const departureDate = new Date(values.departure_date);
      const collectionDate = new Date(values.collection_date);

      // Validation supplémentaire des dates
      if (collectionDate > departureDate) {
        throw new Error("La date de collecte ne peut pas être après la date de départ");
      }

      // Validation de la capacité
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
          collection_date: collectionDate.toISOString(),
          route: values.route,
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

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Modifier la tournée
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre tournée. Tous les champs sont obligatoires.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-6">
              <TourBasicInfo form={form} />
              <TourDates form={form} />
              <TourCollectionPoints form={form} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white"
              >
                {loading ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}