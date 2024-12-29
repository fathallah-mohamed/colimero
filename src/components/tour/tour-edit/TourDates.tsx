import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TourDatesProps {
  form: UseFormReturn<any>;
}

export function TourDates({ form }: TourDatesProps) {
  return (
    <div>
      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de départ</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}