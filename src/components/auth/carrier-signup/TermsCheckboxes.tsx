import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";

interface TermsCheckboxesProps {
  form: UseFormReturn<FormValues>;
}

export function TermsCheckboxes({ form }: TermsCheckboxesProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label className="text-sm text-muted-foreground leading-normal">
              Je certifie que toutes les informations fournies sont exactes.
            </label>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customs_terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label className="text-sm text-muted-foreground leading-normal">
              Je m'engage à respecter les lois et réglementations douanières lors du transport des colis.
            </label>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsibility_terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label className="text-sm text-muted-foreground leading-normal">
              Je reconnais être entièrement responsable des objets transportés dans mes tournées.
            </label>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}