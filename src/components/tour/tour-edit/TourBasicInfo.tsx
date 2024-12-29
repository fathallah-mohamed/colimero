import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TourBasicInfoProps {
  form: UseFormReturn<any>;
  tour: any;
}

export function TourBasicInfo({ form, tour }: TourBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
                  value={field.value || tour?.total_capacity?.toString()}
                  className="bg-white"
                  placeholder="Entrez la capacité totale" 
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
              <FormLabel>Capacité restante (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || tour?.remaining_capacity?.toString()}
                  className="bg-white"
                  placeholder="Entrez la capacité restante" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departure_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de départ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || tour?.departure_country}>
                <FormControl>
                  <SelectTrigger className="bg-white">
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
              <Select onValueChange={field.onChange} value={field.value || tour?.destination_country}>
                <FormControl>
                  <SelectTrigger className="bg-white">
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
          name="type"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Type de tournée</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || tour?.type}>
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}