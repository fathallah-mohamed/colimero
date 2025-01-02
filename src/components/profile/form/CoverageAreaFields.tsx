import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";

const countryOptions = [
  { id: "FR", label: "France" },
  { id: "TN", label: "Tunisie" },
  { id: "MA", label: "Maroc" },
  { id: "DZ", label: "Algérie" },
];

interface CoverageAreaFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function CoverageAreaFields({ form }: CoverageAreaFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="coverage_area"
      render={() => (
        <FormItem>
          <FormLabel>Zones de couverture</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {countryOptions.map((country) => (
              <FormField
                key={country.id}
                control={form.control}
                name="coverage_area"
                render={({ field }) => (
                  <FormItem
                    key={country.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(country.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, country.id]
                            : field.value?.filter((value) => value !== country.id);
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
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