import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Package2, Weight } from "lucide-react";
import type { TourFormValues } from "../types";

interface CapacitySectionProps {
  form: UseFormReturn<TourFormValues>;
}

export function CapacitySection({ form }: CapacitySectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Capacité de transport</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}