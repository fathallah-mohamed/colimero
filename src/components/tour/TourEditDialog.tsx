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
import { useForm } from "react-hook-form";
import type { RouteStop } from "@/types/tour";
import type { Json } from "@/integrations/supabase/types";

interface TourEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tour: any;
  onComplete: () => void;
}

interface FormData {
  total_capacity: string;
  remaining_capacity: string;
  type: string;
  departure_date: string;
  collection_date: string;
  route: RouteStop[];
}

export function TourEditDialog({ isOpen, onClose, tour, onComplete }: TourEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      total_capacity: tour?.total_capacity?.toString() || "",
      remaining_capacity: tour?.remaining_capacity?.toString() || "",
      type: tour?.type || "",
      departure_date: tour?.departure_date ? new Date(tour.departure_date).toISOString().split('T')[0] : "",
      collection_date: tour?.collection_date ? new Date(tour.collection_date).toISOString().split('T')[0] : "",
      route: Array.isArray(tour?.route) ? tour.route : JSON.parse(tour?.route || "[]"),
    }
  });

  const { watch, setValue } = form;
  const formData = watch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    setLoading(true);
    // Convert RouteStop[] to Json type for Supabase
    const routeJson = formData.route as unknown as Json;

    const { error } = await supabase
      .from('tours')
      .update({
        total_capacity: Number(formData.total_capacity),
        remaining_capacity: Number(formData.remaining_capacity),
        type: formData.type,
        departure_date: new Date(formData.departure_date).toISOString(),
        collection_date: new Date(formData.collection_date).toISOString(),
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
    setValue('route', [
      ...formData.route,
      {
        name: "",
        location: "",
        time: "08:00",
        type: "pickup" as const,
      },
    ]);
  };

  const removeCollectionPoint = (index: number) => {
    setValue('route', formData.route.filter((_, i) => i !== index));
  };

  const updateCollectionPoint = (index: number, field: keyof RouteStop, value: string) => {
    const newRoute = formData.route.map((point, i) => 
      i === index ? { ...point, [field]: value } : point
    );
    setValue('route', newRoute);
  };

  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la tournée</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_capacity">Capacité totale (kg)</Label>
              <Input
                type="number"
                id="total_capacity"
                value={formData.total_capacity}
                onChange={(e) => setValue('total_capacity', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remaining_capacity">Capacité restante (kg)</Label>
              <Input
                type="number"
                id="remaining_capacity"
                value={formData.remaining_capacity}
                onChange={(e) => setValue('remaining_capacity', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de tournée</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setValue('type', value)}
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
                value={formData.departure_date}
                onChange={(e) => setValue('departure_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_date">Date de collecte</Label>
              <Input
                type="date"
                id="collection_date"
                value={formData.collection_date}
                onChange={(e) => setValue('collection_date', e.target.value)}
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
              {formData.route.map((point, index) => (
                <CollectionPointForm
                  key={index}
                  index={index}
                  point={point}
                  onRemove={removeCollectionPoint}
                  onUpdate={updateCollectionPoint}
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
      </DialogContent>
    </Dialog>
  );
}