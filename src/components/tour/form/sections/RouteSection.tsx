import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { TourFormValues } from "../types";

interface RouteSectionProps {
  form: UseFormReturn<TourFormValues>;
}

export function RouteSection({ form }: RouteSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informations de trajet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="departure_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de départ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="TN">Tunisie</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de destination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="TN">Tunisie</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departure_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de départ</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  onChange={(e) => {
                    // Convert string date to Date object
                    const date = new Date(e.target.value);
                    field.onChange(date);
                  }}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]}
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