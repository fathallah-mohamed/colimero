import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CapacityFieldsProps {
  form: UseFormReturn<any>;
}

export function CapacityFields({ form }: CapacityFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="total_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacité totale (kg)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="1000"
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
                placeholder="12"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}