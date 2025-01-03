import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionPointForm } from "../CollectionPointForm";
import { FormSection } from "./FormSection";

interface CollectionPointsSectionProps {
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  form: UseFormReturn<any>;
  departureDate: Date;
}

export function CollectionPointsSection({
  fields,
  append,
  remove,
  form,
  departureDate,
}: CollectionPointsSectionProps) {
  return (
    <FormSection title="Points de collecte">
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              location: "",
              time: "",
              type: "pickup",
              collection_date: new Date().toISOString().split('T')[0],
            })
          }
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un point
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </FormSection>
  );
}