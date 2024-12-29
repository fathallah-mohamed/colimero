import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { COUNTRY_OPTIONS } from "./constants";

interface CoverageFieldsProps {
  form: UseFormReturn<any>;
}

export function CoverageFields({ form }: CoverageFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="coverage_area"
      render={() => (
        <FormItem>
          <FormLabel>Zones de couverture</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {COUNTRY_OPTIONS.map((country) => (
              <FormField
                key={country.id}
                control={form.control}
                name="coverage_area"
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