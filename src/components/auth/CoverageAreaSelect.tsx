import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const countryOptions = [
  { id: "FR", label: "France" },
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
      name="coverageArea"
      render={() => (
        <FormItem>
          <FormLabel className="text-base">Zones de couverture</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {countryOptions.map((country) => (
              <FormField
                key={country.id}
                control={form.control}
                name="coverageArea"
                render={({ field }) => (
                  <Card className="p-4 hover:bg-gray-50 transition-colors">
                    <FormItem
                      key={country.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <Checkbox
                        checked={field.value?.includes(country.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, country.id]
                            : field.value?.filter((value: string) => value !== country.id);
                          field.onChange(updatedValue);
                        }}
                      />
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <FormLabel className="font-normal">
                          {country.label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  </Card>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}