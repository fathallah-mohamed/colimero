import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SpecialItemsSectionProps {
  specialItems: string[];
  itemQuantities: Record<string, number>;
  onSpecialItemChange: (items: string[]) => void;
  onQuantityChange: (item: string, quantity: number) => void;
}

export function SpecialItemsSection({
  specialItems,
  itemQuantities,
  onSpecialItemChange,
  onQuantityChange,
}: SpecialItemsSectionProps) {
  const availableItems = ["Électronique", "Fragile", "Verre", "Documents"];

  const handleItemToggle = (item: string) => {
    const newItems = specialItems.includes(item)
      ? specialItems.filter((i) => i !== item)
      : [...specialItems, item];
    onSpecialItemChange(newItems);
  };

  return (
    <div className="space-y-4">
      <Label>Objets spéciaux</Label>
      <div className="space-y-2">
        {availableItems.map((item) => (
          <div key={item} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`item-${item}`}
                checked={specialItems.includes(item)}
                onCheckedChange={() => handleItemToggle(item)}
              />
              <Label htmlFor={`item-${item}`}>{item}</Label>
            </div>
            {specialItems.includes(item) && (
              <Input
                type="number"
                min="1"
                value={itemQuantities[item] || 1}
                onChange={(e) => onQuantityChange(item, parseInt(e.target.value))}
                className="w-20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}