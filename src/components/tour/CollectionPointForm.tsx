import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import type { RouteStop } from "@/types/tour";

interface CollectionPointFormProps {
  index: number;
  point: RouteStop;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof RouteStop, value: string) => void;
}

export function CollectionPointForm({ index, point, onRemove, onUpdate }: CollectionPointFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Point de collecte {index + 1}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ville</Label>
          <Input
            value={point.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            placeholder="Nom de la ville"
          />
        </div>

        <div className="space-y-2">
          <Label>Adresse</Label>
          <Input
            value={point.location}
            onChange={(e) => onUpdate(index, 'location', e.target.value)}
            placeholder="Adresse précise"
          />
        </div>

        <div className="space-y-2">
          <Label>Heure</Label>
          <Input
            type="time"
            value={point.time}
            onChange={(e) => onUpdate(index, 'time', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}