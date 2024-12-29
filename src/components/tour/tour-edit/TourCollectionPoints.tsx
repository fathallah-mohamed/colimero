import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CollectionPointForm } from "../CollectionPointForm";

interface TourCollectionPointsProps {
  form: UseFormReturn<any>;
}

export function TourCollectionPoints({ form }: TourCollectionPointsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route"
  });

  const addCollectionPoint = () => {
    append({
      name: "",
      location: "",
      time: "08:00",
      type: "pickup" as const,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Points de collecte</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCollectionPoint}
          className="text-primary hover:text-primary-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un point
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <CollectionPointForm
            key={field.id}
            index={index}
            onRemove={remove}
            form={form}
          />
        ))}
      </div>
    </div>
  );
}