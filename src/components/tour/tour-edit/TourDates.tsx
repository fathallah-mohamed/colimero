import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TourDatesProps {
  form: UseFormReturn<any>;
}

export function TourDates({ form }: TourDatesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de départ</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="collection_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de collecte</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="bg-white" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}