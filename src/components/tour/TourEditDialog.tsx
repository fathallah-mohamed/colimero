import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CollectionPointForm } from "./CollectionPointForm";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { RouteStop } from "@/types/tour";

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route"
  });

  const handleSubmit = async (values: any) => {
    if (!tour) return;

    setLoading(true);
    const routeJson = values.route as unknown as Json;

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

  const addCollectionPoint = () => {
    append({
      name: "",
      location: "",
      time: "08:00",
      type: "pickup" as const,
    });
  };

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la tournée</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_capacity">Capacité totale (kg)</Label>
                <Input
                  type="number"
                  id="total_capacity"
                  {...form.register('total_capacity')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remaining_capacity">Capacité restante (kg)</Label>
                <Input
                  type="number"
                  id="remaining_capacity"
                  {...form.register('remaining_capacity')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de tournée</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Publique</SelectItem>
                  <SelectItem value="private">Privée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_date">Date de départ</Label>
                <Input
                  type="date"
                  id="departure_date"
                  {...form.register('departure_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection_date">Date de collecte</Label>
                <Input
                  type="date"
                  id="collection_date"
                  {...form.register('collection_date')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Points de collecte</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCollectionPoint}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un point
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <CollectionPointForm
                    key={field.id}
                    index={index}
                    onRemove={remove}
                    form={form}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}