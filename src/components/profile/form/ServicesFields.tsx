import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";

const serviceOptions = [
  { id: "livraison_express", label: "Livraison Express", icon: "truck" },
  { id: "livraison_domicile", label: "Livraison à domicile", icon: "home" },
  { id: "transport_standard", label: "Transport de colis standard", icon: "package" },
  { id: "transport_volumineux", label: "Transport d'objets volumineux", icon: "sofa" },
  { id: "collecte_programmee", label: "Collecte programmée", icon: "calendar" },
];

interface ServicesFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ServicesFields({ form }: ServicesFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel>Services proposés</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {serviceOptions.map((service) => (
              <FormField
                key={service.id}
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem
                    key={service.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(service.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, service.id]
                            : field.value?.filter((value) => value !== service.id);
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
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