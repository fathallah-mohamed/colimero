import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxesProps {
  form: UseFormReturn<any>;
}

export function TermsCheckboxes({ form }: TermsCheckboxesProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                J'accepte les conditions générales
              </FormLabel>
              <p className="text-sm text-gray-500">
                Je m'engage à respecter les conditions d'utilisation de la plateforme
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customs_terms_accepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Je m'engage à respecter les règles douanières
              </FormLabel>
              <p className="text-sm text-gray-500">
                Je déclare avoir pris connaissance des règles douanières en vigueur
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
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                J'accepte les conditions de responsabilité
              </FormLabel>
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