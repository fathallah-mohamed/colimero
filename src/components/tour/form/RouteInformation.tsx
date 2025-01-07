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
import { FormSection } from "./FormSection";

interface RouteInformationProps {
  form: UseFormReturn<any>;
}

export function RouteInformation({ form }: RouteInformationProps) {
  return (
    <FormSection title="Informations de route">
      <div className="grid gap-6 md:grid-cols-2">
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
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}