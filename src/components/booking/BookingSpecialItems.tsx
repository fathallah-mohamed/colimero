import { Label } from "@/components/ui/label";

interface SpecialItem {
  name: string;
  price: number;
  icon: string;
}

interface BookingSpecialItemsProps {
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  specialItems: SpecialItem[];
}

export function BookingSpecialItems({ selectedItems, onItemToggle, specialItems }: BookingSpecialItemsProps) {
  return (
    <div className="space-y-2">
      <Label>Objets spéciaux (choix multiples)</Label>
      <div className="grid grid-cols-3 gap-4">
        {specialItems.map((item) => (
          <div
            key={item.name}
            className={`p-4 border rounded-lg cursor-pointer text-center ${
              selectedItems.includes(item.name)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => onItemToggle(item.name)}
          >
            <span className="text-sm block mb-1">{item.name}</span>
            <span className="text-sm font-medium">{item.price}€</span>
          </div>
        ))}
      </div>
    </div>
  );
}