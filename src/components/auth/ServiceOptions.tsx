import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Truck, Home, Package, Sofa, Calendar } from "lucide-react";

const serviceOptions = [
  { id: "livraison_express", label: "Livraison Express", icon: Truck },
  { id: "livraison_domicile", label: "Livraison à domicile", icon: Home },
  { id: "transport_standard", label: "Transport de colis standard", icon: Package },
  { id: "transport_volumineux", label: "Transport d'objets volumineux", icon: Sofa },
  { id: "collecte_programmee", label: "Collecte programmée", icon: Calendar },
];

interface ServiceOptionsProps {
  form: UseFormReturn<any>;
}

export function ServiceOptions({ form }: ServiceOptionsProps) {
  const { toast } = useToast();

  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel>Services proposés (maximum 5)</FormLabel>
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
                    <Checkbox
                      checked={field.value?.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked && field.value?.length >= 5) {
                          toast({
                            variant: "destructive",
                            title: "Limite atteinte",
                            description: "Vous ne pouvez pas sélectionner plus de 5 services",
                          });
                          return;
                        }
                        const updatedValue = checked
                          ? [...(field.value || []), service.id]
                          : field.value?.filter((value: string) => value !== service.id);
                        field.onChange(updatedValue);
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <service.icon className="h-4 w-4 text-gray-500" />
                      <FormLabel className="font-normal">
                        {service.label}
                      </FormLabel>
                    </div>
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