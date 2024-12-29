import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { SERVICE_OPTIONS } from "./constants";

interface ServiceFieldsProps {
  form: UseFormReturn<any>;
}

export function ServiceFields({ form }: ServiceFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel>Services proposés</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {SERVICE_OPTIONS.map((service) => (
              <FormField
                key={service.id}
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem
                    key={service.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <Checkbox
                      checked={field.value?.includes(service.id)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...field.value, service.id]
                          : field.value?.filter((value: string) => value !== service.id);
                        field.onChange(updatedValue);
                      }}
                    />
                    <FormLabel className="font-normal">
                      {service.label}
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