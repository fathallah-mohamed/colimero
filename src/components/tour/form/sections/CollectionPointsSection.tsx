import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionPoint } from "./CollectionPoint";
import type { TourFormValues } from "../types";

interface CollectionPointsSectionProps {
  form: UseFormReturn<TourFormValues>;
}

export function CollectionPointsSection({ form }: CollectionPointsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Points de collecte</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              location: "",
              time: "",
              type: "pickup",
              collection_date: new Date().toISOString().split('T')[0],
            })
          }
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un point
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <CollectionPoint
            key={field.id}
            form={form}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}