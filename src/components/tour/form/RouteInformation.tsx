import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface RouteInformationProps {
  form: UseFormReturn<any>;
}

export function RouteInformation({ form }: RouteInformationProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
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
      </div>
    </div>
  );
}