import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const countryOptions = [
  { id: "TN", label: "Tunisie" },
  { id: "MA", label: "Maroc" },
  { id: "DZ", label: "Algérie" },
];

interface CoverageAreaSelectProps {
  form: UseFormReturn<any>;
}

export function CoverageAreaSelect({ form }: CoverageAreaSelectProps) {
  return (
    <FormField
      control={form.control}
      name="coverage_area"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Zone de couverture</FormLabel>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">France (obligatoire)</span>
            </div>
            
            <FormLabel className="text-sm">Sélectionnez un pays du Maghreb :</FormLabel>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(['FR', value]);
              }}
              value={field.value?.[1] || ""}
              className="grid grid-cols-1 gap-4 mt-2"
            >
              {countryOptions.map((country) => (
                <Card key={country.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={country.id} id={country.id} />
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <label htmlFor={country.id} className="font-normal cursor-pointer">
                        {country.label}
                      </label>
                    </div>
                  </div>
                </Card>
              ))}
            </RadioGroup>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}