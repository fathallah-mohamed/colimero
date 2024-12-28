import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StopPointProps {
  stopId: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
}

export function StopPoint({ stopId, form, onRemove }: StopPointProps) {
  return (
    <div className="p-4 border rounded-lg relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`route.${stopId - 1}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${stopId - 1}.location`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${stopId - 1}.time`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}