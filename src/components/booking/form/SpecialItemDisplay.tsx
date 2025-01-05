import { Badge } from "@/components/ui/badge";

interface SpecialItemDisplayProps {
  item: {
    name: string;
    quantity: number;
  };
}

export function SpecialItemDisplay({ item }: SpecialItemDisplayProps) {
  return (
    <Badge variant="secondary" className="flex items-center gap-2">
      <span>{item.name}</span>
      <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
        {item.quantity}
      </span>
    </Badge>
  );
}