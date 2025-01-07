import { UseFormReturn } from "react-hook-form";
import { RouteInformation } from "./RouteInformation";
import { CapacityInformation } from "./CapacityInformation";
import { CollectionPointsSection } from "./CollectionPointsSection";
import { DeclarationsSection } from "./DeclarationsSection";
import { CommitmentsSection } from "./CommitmentsSection";

interface TourFormSectionsProps {
  form: UseFormReturn<any>;
}

export function TourFormSections({ form }: TourFormSectionsProps) {
  const departureDate = form.watch('departure_date');

  return (
    <div className="space-y-6">
      <RouteInformation form={form} />
      <CapacityInformation form={form} />
      <CollectionPointsSection
        fields={form.getValues("route")}
        append={(value) => form.setValue("route", [...form.getValues("route"), value])}
        remove={(index) => {
          const currentRoute = form.getValues("route");
          form.setValue("route", currentRoute.filter((_, i) => i !== index));
        }}
        form={form}
        departureDate={departureDate}
      />
      <DeclarationsSection form={form} />
      <CommitmentsSection form={form} />
    </div>
  );
}