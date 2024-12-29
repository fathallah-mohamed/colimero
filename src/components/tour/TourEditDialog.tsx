import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [formData, setFormData] = useState({
    total_capacity: "",
    remaining_capacity: "",
    type: "",
    departure_date: "",
    collection_date: "",
    route: [] as RouteStop[],
  });

  // Mettre à jour les données du formulaire quand une tournée est sélectionnée
  useState(() => {
    if (tour) {
      setFormData({
        total_capacity: tour.total_capacity,
        remaining_capacity: tour.remaining_capacity,
        type: tour.type,
        departure_date: new Date(tour.departure_date).toISOString().split('T')[0],
        collection_date: new Date(tour.collection_date).toISOString().split('T')[0],
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route),
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    setLoading(true);
    const { error } = await supabase
      .from('tours')
      .update({
        total_capacity: Number(formData.total_capacity),
        remaining_capacity: Number(formData.remaining_capacity),
        type: formData.type,
        departure_date: new Date(formData.departure_date).toISOString(),
        collection_date: new Date(formData.collection_date).toISOString(),
        route: formData.route,
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
    setFormData(prev => ({
      ...prev,
      route: [
        ...prev.route,
        {
          name: "",
          location: "",
          time: "08:00",
          type: "pickup" as const,
        },
      ],
    }));
  };

  const removeCollectionPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      route: prev.route.filter((_, i) => i !== index),
    }));
  };

  const updateCollectionPoint = (index: number, field: keyof RouteStop, value: string) => {
    setFormData(prev => ({
      ...prev,
      route: prev.route.map((point, i) => 
        i === index ? { ...point, [field]: value } : point
      ),
    }));
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
                onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remaining_capacity">Capacité restante (kg)</Label>
              <Input
                type="number"
                id="remaining_capacity"
                value={formData.remaining_capacity}
                onChange={(e) => setFormData({ ...formData, remaining_capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de tournée</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
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
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection_date">Date de collecte</Label>
              <Input
                type="date"
                id="collection_date"
                value={formData.collection_date}
                onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
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
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Point de collecte {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollectionPoint(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input
                        value={point.name}
                        onChange={(e) => updateCollectionPoint(index, 'name', e.target.value)}
                        placeholder="Nom de la ville"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input
                        value={point.location}
                        onChange={(e) => updateCollectionPoint(index, 'location', e.target.value)}
                        placeholder="Adresse précise"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Heure</Label>
                      <Input
                        type="time"
                        value={point.time}
                        onChange={(e) => updateCollectionPoint(index, 'time', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
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