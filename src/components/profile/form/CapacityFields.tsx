import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";

interface CapacityFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function CapacityFields({ form }: CapacityFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="total_capacity"
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
        name="price_per_kg"
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