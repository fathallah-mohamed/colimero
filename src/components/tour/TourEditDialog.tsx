import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourEditForm } from "./tour-edit/TourEditForm";
import { tourFormSchema } from "./tour-edit/TourValidationSchema";
import { useTourEdit } from "./tour-edit/useTourEdit";

interface TourEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tour: any;
  onComplete: () => void;
}

export function TourEditDialog({ isOpen, onClose, tour, onComplete }: TourEditDialogProps) {
  const { loading, handleSubmit } = useTourEdit(tour, onComplete);
  
  const form = useForm({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      total_capacity: tour?.total_capacity?.toString() || "",
      remaining_capacity: tour?.remaining_capacity?.toString() || "",
      type: tour?.type || "public",
      departure_date: tour?.departure_date ? new Date(tour.departure_date).toISOString().split('T')[0] : "",
      route: tour?.route ? tour.route.map((stop: any) => ({
        name: stop.name || "",
        location: stop.location || "",
        time: stop.time || "",
        collection_date: stop.collection_date ? new Date(stop.collection_date).toISOString().split('T')[0] : "",
        type: stop.type || "pickup"
      })) : [],
      departure_country: tour?.departure_country || "FR",
      destination_country: tour?.destination_country || "TN",
      terms_accepted: false,
      customs_declaration: false
    }
  });

  if (!tour) return null;

  const isFormValid = form.formState.isValid && 
                     form.watch('terms_accepted') && 
                     form.watch('customs_declaration');

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
        <TourEditForm 
          form={form} 
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          isFormValid={isFormValid}
          tour={tour}
        />
      </DialogContent>
    </Dialog>
  );
}