import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Package2, Weight } from "lucide-react";
import { FormSection } from "./FormSection";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

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

  const handleTotalCapacityChange = (value: number[]) => {
    const newTotal = value[0];
    form.setValue("total_capacity", newTotal);
    form.setValue("remaining_capacity", newTotal);
  };

  const handleRemainingCapacityChange = (value: number[]) => {
    const newRemaining = Math.min(value[0], totalCapacity);
    form.setValue("remaining_capacity", newRemaining);
  };

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
                <div className="space-y-4">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Exemple : 1000 kg"
                      {...field}
                      className="text-center"
                      readOnly
                    />
                  </FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    max={5000}
                    step={100}
                    onValueChange={handleTotalCapacityChange}
                  />
                </div>
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
                <div className="space-y-4">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Capacité restante"
                      {...field}
                      className="text-center"
                      readOnly
                    />
                  </FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    max={totalCapacity}
                    step={100}
                    onValueChange={handleRemainingCapacityChange}
                  />
                </div>
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