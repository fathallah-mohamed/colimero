import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Truck, Home, Package, Sofa, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Services proposés (maximum 5)</FormLabel>
          <div className="grid grid-cols-1 gap-3">
            {serviceOptions.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormField
                  key={service.id}
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <Card className="relative overflow-hidden transition-all hover:shadow-md">
                      <FormItem
                        key={service.id}
                        className="flex items-start space-x-3 p-4"
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
                        <div className="flex items-center space-x-3">
                          <service.icon className="h-5 w-5 text-gray-500" />
                          <FormLabel className="font-medium cursor-pointer">
                            {service.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    </Card>
                  )}
                />
              </motion.div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}