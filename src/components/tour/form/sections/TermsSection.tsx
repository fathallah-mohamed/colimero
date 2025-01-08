import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { TourFormValues } from "../types";

interface TermsSectionProps {
  form: UseFormReturn<TourFormValues>;
}

export function TermsSection({ form }: TermsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Déclarations et engagements</h2>
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
                <label className="text-sm font-medium">
                  J'accepte les conditions générales de transport
                </label>
                <p className="text-sm text-gray-500">
                  Je m'engage à respecter les règles et conditions de transport
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
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">
                  Je déclare respecter les règles douanières
                </label>
                <p className="text-sm text-gray-500">
                  Je m'engage à respecter toutes les réglementations douanières en vigueur
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}