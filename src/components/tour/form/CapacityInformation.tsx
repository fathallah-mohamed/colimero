import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Package2, Weight } from "lucide-react";
import { FormSection } from "./FormSection";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface CapacityInformationProps {
  form: UseFormReturn<any>;
}

export function CapacityInformation({ form }: CapacityInformationProps) {
  const [capacityPercentage, setCapacityPercentage] = useState(100);
  const totalCapacity = form.watch("total_capacity");
  const remainingCapacity = form.watch("remaining_capacity");

  useEffect(() => {
    if (totalCapacity && remainingCapacity) {
      const percentage = (remainingCapacity / totalCapacity) * 100;
      setCapacityPercentage(Math.min(100, Math.max(0, percentage)));
    }
  }, [totalCapacity, remainingCapacity]);

  return (
    <FormSection title="Capacité de transport">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="total_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Package2 className="w-4 h-4" />
                  Capacité totale (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Exemple : 1000 kg"
                    {...field}
                    className="w-full"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      // Mettre à jour automatiquement la capacité restante
                      form.setValue("remaining_capacity", value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Capacité maximale de transport en kilogrammes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remaining_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Capacité disponible (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Capacité restante"
                    {...field}
                    className="w-full"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const total = form.getValues("total_capacity");
                      if (value <= total) {
                        field.onChange(value);
                      } else {
                        field.onChange(total);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Ne peut pas dépasser la capacité totale
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Capacité utilisée</span>
            <span>{100 - capacityPercentage}%</span>
          </div>
          <Progress value={100 - capacityPercentage} className="h-2" />
        </div>
      </div>
    </FormSection>
  );
}