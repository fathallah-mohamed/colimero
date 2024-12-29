import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

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
          <FormLabel>Zones de couverture</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {countryOptions.map((country) => (
              <FormField
                key={country.id}
                control={form.control}
                name="coverageArea"
                render={({ field }) => (
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
                    <FormLabel className="font-normal">
                      {country.label}
                    </FormLabel>
                  </FormItem>
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