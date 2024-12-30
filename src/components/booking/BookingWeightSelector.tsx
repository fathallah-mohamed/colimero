import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface BookingWeightSelectorProps {
  weight: number;
  onWeightChange: (increment: boolean) => void;
}

export function BookingWeightSelector({ weight, onWeightChange }: BookingWeightSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Poids (kg) - minimum 5 kg, maximum 30 kg</Label>
      <div className="flex items-center justify-between">
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={() => onWeightChange(false)}
          disabled={weight <= 5}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-medium">{weight}</span>
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={() => onWeightChange(true)}
          disabled={weight >= 30}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}