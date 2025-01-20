import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";

interface RecipientStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function RecipientStep({ form }: RecipientStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Informations du destinataire</h2>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Nom du destinataire" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
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
            <FormItem>
              <FormLabel>Adresse complète</FormLabel>
              <FormControl>
                <Input placeholder="Adresse de livraison" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}