import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";

interface RecipientSectionProps {
  form: UseFormReturn<BookingFormData>;
}

export function RecipientSection({ form }: RecipientSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations du destinataire</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du destinataire</FormLabel>
              <FormControl>
                <Input placeholder="Nom complet" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone du destinataire</FormLabel>
              <FormControl>
                <Input placeholder="+33 6 XX XX XX XX" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Adresse du destinataire</FormLabel>
              <FormControl>
                <Input placeholder="Adresse complète" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}