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
  tour: any;
}

export function TourDates({ form, tour }: TourDatesProps) {
  return (
    <div>
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
                value={field.value || (tour?.departure_date ? new Date(tour.departure_date).toISOString().split('T')[0] : '')}
                className="bg-white" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}