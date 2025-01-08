import { UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSection } from "./FormSection";

interface DeclarationsSectionProps {
  form: UseFormReturn<any>;
}

export function DeclarationsSection({ form }: DeclarationsSectionProps) {
  return (
    <FormSection title="Déclarations">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <FormField
            control={form.control}
            name="customs_declaration"
            render={({ field }) => (
              <div className="flex items-start space-x-3">
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
              </div>
            )}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <FormField
            control={form.control}
            name="terms_accepted"
            render={({ field }) => (
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <label className="text-sm font-medium">
                    J'accepte les conditions générales
                  </label>
                  <p className="text-sm text-gray-500">
                    Je comprends que je suis responsable du respect des lois
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}