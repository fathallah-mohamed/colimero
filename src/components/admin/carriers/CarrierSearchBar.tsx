import { Input } from "@/components/ui/input";

interface CarrierSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function CarrierSearchBar({ value, onChange }: CarrierSearchBarProps) {
  return (
    <Input
      placeholder="Rechercher par nom ou email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm mb-4"
    />
  );
}