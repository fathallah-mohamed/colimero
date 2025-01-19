import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";

interface SenderSectionProps {
  form: UseFormReturn<BookingFormData>;
}

export function SenderSection({ form }: SenderSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de l'expéditeur</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'expéditeur</FormLabel>
              <FormControl>
                <Input placeholder="Nom complet" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sender_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone de l'expéditeur</FormLabel>
              <FormControl>
                <Input placeholder="+33 6 XX XX XX XX" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}