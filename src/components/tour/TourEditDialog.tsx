import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la tournée</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="total_capacity">Capacité totale (kg)</Label>
            <Input
              type="number"
              id="total_capacity"
              value={formData.total_capacity}
              onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="remaining_capacity">Capacité restante (kg)</Label>
            <Input
              type="number"
              id="remaining_capacity"
              value={formData.remaining_capacity}
              onChange={(e) => setFormData({ ...formData, remaining_capacity: e.target.value })}
            />
          </div>

          <div className="grid w-full gap-1.5">
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

          <div className="grid w-full gap-1.5">
            <Label htmlFor="departure_date">Date de départ</Label>
            <Input
              type="date"
              id="departure_date"
              value={formData.departure_date}
              onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="collection_date">Date de collecte</Label>
            <Input
              type="date"
              id="collection_date"
              value={formData.collection_date}
              onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
            />
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