import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CompanyInfoFieldsProps {
  form: UseFormReturn<any>;
}

export function CompanyInfoFields({ form }: CompanyInfoFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Nom de l'entreprise</FormLabel>
            <FormControl>
              <Input placeholder="Nom de votre entreprise" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="siret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SIRET</FormLabel>
            <FormControl>
              <Input placeholder="Numéro SIRET" {...field} />
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
              <Input placeholder="+33 6 12 34 56 78" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Adresse complète de l'entreprise"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}