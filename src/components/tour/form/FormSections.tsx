import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { RouteSection } from "./sections/RouteSection";
import { CapacitySection } from "./sections/CapacitySection";
import { CollectionPointsSection } from "./sections/CollectionPointsSection";
import { TermsSection } from "./sections/TermsSection";
import type { TourFormValues } from "./types";

interface FormSectionsProps {
  form: UseFormReturn<TourFormValues>;
}

export function FormSections({ form }: FormSectionsProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="p-6">
          <RouteSection form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <CapacitySection form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <CollectionPointsSection form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <TermsSection form={form} />
        </CardContent>
      </Card>
    </div>
  );
}