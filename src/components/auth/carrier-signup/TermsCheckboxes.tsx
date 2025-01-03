import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { CarrierSignupFormValues } from "./FormSchema";

interface TermsCheckboxesProps {
  form: UseFormReturn<CarrierSignupFormValues>;
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
            <div className="space-y-1 leading-none">
              <label className="text-sm font-medium">
                J'accepte les conditions générales
              </label>
              <p className="text-sm text-gray-500">
                Je comprends et j'accepte les conditions d'utilisation
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customs_declaration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <div className="space-y-1 leading-none">
              <label className="text-sm font-medium">
                Je déclare que je respecterai toutes les lois douanières
              </label>
              <p className="text-sm text-gray-500">
                Je suis responsable des objets que je transporte
              </p>
            </div>
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
            <div className="space-y-1 leading-none">
              <label className="text-sm font-medium">
                J'accepte les termes de responsabilité
              </label>
              <p className="text-sm text-gray-500">
                Je comprends mes responsabilités en tant que transporteur
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}