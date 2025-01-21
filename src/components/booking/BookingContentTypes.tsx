import { Label } from "@/components/ui/label";

interface BookingContentTypesProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  contentTypes: string[];
}

export function BookingContentTypes({ selectedTypes, onTypeToggle, contentTypes }: BookingContentTypesProps) {
  return (
    <div className="space-y-2">
      <Label>Contenu (choix multiples)</Label>
      <div className="grid grid-cols-2 gap-2">
        {contentTypes.map((type) => (
          <div
            key={type}
            className={`p-4 border rounded-lg cursor-pointer text-center ${
              selectedTypes.includes(type)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => onTypeToggle(type)}
          >
            <span className="text-sm">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}