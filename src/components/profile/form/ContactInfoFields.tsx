import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactInfoFieldsProps {
  form: UseFormReturn<any>;
}

export function ContactInfoFields({ form }: ContactInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone principal *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="+33 6 XX XX XX XX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone_secondary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone secondaire (optionnel)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="+33 6 XX XX XX XX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Votre adresse" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}