import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionPointForm } from "../CollectionPointForm";
import { useFieldArray } from "react-hook-form";

interface TourCollectionPointsProps {
  form: UseFormReturn<any>;
}

export function TourCollectionPoints({ form }: TourCollectionPointsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route"
  });

  const departureDate = new Date(form.watch('departure_date'));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Points de collecte</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({
            name: "",
            location: "",
            time: "",
            type: "pickup",
            collection_date: new Date().toISOString().split('T')[0],
          })}
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
            departureDate={departureDate}
          />
        ))}
      </div>
    </div>
  );
}