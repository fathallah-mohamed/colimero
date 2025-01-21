import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface SpecialItem {
  name: string;
  price: number;
  icon: string;
}

interface BookingSpecialItemsProps {
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  specialItems: SpecialItem[];
  itemQuantities: Record<string, number>;
  onQuantityChange: (itemName: string, increment: boolean) => void;
}

export function BookingSpecialItems({ 
  selectedItems, 
  onItemToggle, 
  specialItems,
  itemQuantities,
  onQuantityChange 
}: BookingSpecialItemsProps) {
  return (
    <div className="space-y-2">
      <Label>Objets spéciaux (choix multiples)</Label>
      <div className="grid grid-cols-3 gap-4">
        {specialItems.map((item) => (
          <div
            key={item.name}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedItems.includes(item.name)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => onItemToggle(item.name)}
          >
            <div className="text-center">
              <span className="text-sm block mb-1">{item.name}</span>
              <span className="text-sm font-medium">{item.price}€</span>
              
              {selectedItems.includes(item.name) && (
                <div className="flex items-center justify-center mt-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuantityChange(item.name, false);
                    }}
                    disabled={itemQuantities[item.name] <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">
                    {itemQuantities[item.name] || 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuantityChange(item.name, true);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}