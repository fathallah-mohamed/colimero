import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TourBasicInfoProps {
  form: UseFormReturn<any>;
}

export function TourBasicInfo({ form }: TourBasicInfoProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="total_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacité totale (kg)</FormLabel>
            <FormControl>
              <Input type="number" {...field} className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="remaining_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacité restante (kg)</FormLabel>
            <FormControl>
              <Input type="number" {...field} className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Type de tournée</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Publique</SelectItem>
                <SelectItem value="private">Privée</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}