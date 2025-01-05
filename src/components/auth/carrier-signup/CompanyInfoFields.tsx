import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "./FormSchema";

interface CompanyInfoFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function CompanyInfoFields({ form }: CompanyInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom de l'entreprise <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom de votre entreprise" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("company_name");
                  }}
                />
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
              <FormLabel>
                SIRET <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Numéro SIRET" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("siret");
                  }}
                />
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
              <FormLabel>
                Adresse <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Adresse complète" 
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    form.trigger("address");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}