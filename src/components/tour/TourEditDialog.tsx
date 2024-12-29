import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { TourBasicInfo } from "./tour-edit/TourBasicInfo";
import { TourDates } from "./tour-edit/TourDates";
import { TourCollectionPoints } from "./tour-edit/TourCollectionPoints";

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
    defaultValues: {
      total_capacity: tour?.total_capacity?.toString() || "",
      remaining_capacity: tour?.remaining_capacity?.toString() || "",
      type: tour?.type || "",
      departure_date: tour?.departure_date ? new Date(tour.departure_date).toISOString().split('T')[0] : "",
      collection_date: tour?.collection_date ? new Date(tour.collection_date).toISOString().split('T')[0] : "",
      route: Array.isArray(tour?.route) ? tour.route : [],
    }
  });

  const handleSubmit = async (values: any) => {
    if (!tour) return;

    setLoading(true);
    const routeJson = values.route;

    const { error } = await supabase
      .from('tours')
      .update({
        total_capacity: Number(values.total_capacity),
        remaining_capacity: Number(values.remaining_capacity),
        type: values.type,
        departure_date: new Date(values.departure_date).toISOString(),
        collection_date: new Date(values.collection_date).toISOString(),
        route: routeJson,
      })
      .eq('id', tour.id);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la tournée",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La tournée a été mise à jour",
    });
    onComplete();
  };

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Modifier la tournée
          </DialogTitle>
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