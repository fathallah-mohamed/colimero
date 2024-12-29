import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";

interface CapacityFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function CapacityFields({ form }: CapacityFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="totalCapacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacité totale (kg)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pricePerKg"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix par kg (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}