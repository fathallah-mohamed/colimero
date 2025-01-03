import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
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
        name="customs_declaration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <label className="text-sm font-medium leading-none">
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
              <label className="text-sm font-medium leading-none">
                J'accepte les conditions générales
              </label>
              <p className="text-sm text-gray-500">
                Je comprends que je suis responsable du respect des lois
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}