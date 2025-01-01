import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentTypesSectionProps {
  contentTypes: string[];
  onChange: (types: string[]) => void;
}

export function ContentTypesSection({ contentTypes, onChange }: ContentTypesSectionProps) {
  const availableTypes = [
    "Vêtements",
    "Chaussures",
    "Jouets",
    "Livres",
    "Cosmétiques",
    "Accessoires",
    "Electronique",
    "Produits alimentaires",
    "Médicaments",
    "Documents"
  ];

  const handleTypeToggle = (type: string) => {
    const newTypes = contentTypes.includes(type)
      ? contentTypes.filter((t) => t !== type)
      : [...contentTypes, type];
    onChange(newTypes);
  };

  return (
    <div className="space-y-4">
      <Label>Types de contenu</Label>
      <div className="grid grid-cols-2 gap-2">
        {availableTypes.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <Checkbox
              id={`type-${type}`}
              checked={contentTypes.includes(type)}
              onCheckedChange={() => handleTypeToggle(type)}
            />
            <Label htmlFor={`type-${type}`}>{type}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}