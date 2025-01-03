import { UseFormReturn, useFieldArray } from "react-hook-form";
import { RouteInformation } from "./RouteInformation";
import { CapacityInformation } from "./CapacityInformation";
import { CollectionPointsSection } from "./CollectionPointsSection";
import { DeclarationsSection } from "./DeclarationsSection";

interface TourFormSectionsProps {
  form: UseFormReturn<any>;
}

export function TourFormSections({ form }: TourFormSectionsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "route",
  });

  const departureDate = form.watch('departure_date');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6 md:col-span-2">
        <RouteInformation form={form} />
      </div>
      
      <CapacityInformation form={form} />
      
      <div className="space-y-6 md:col-span-2">
        <CollectionPointsSection
          fields={fields}
          append={append}
          remove={remove}
          form={form}
          departureDate={departureDate}
        />
      </div>
      
      <div className="md:col-span-2">
        <DeclarationsSection form={form} />
      </div>
    </div>
  );
}