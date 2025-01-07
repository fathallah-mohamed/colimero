import { UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSection } from "./FormSection";
import { Link } from "react-router-dom";

interface CommitmentsSectionProps {
  form: UseFormReturn<any>;
}

export function CommitmentsSection({ form }: CommitmentsSectionProps) {
  return (
    <FormSection title="Engagements et responsabilités">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="info_accuracy"
          render={({ field }) => (
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">
                  Je certifie que toutes les informations saisies pour cette tournée sont exactes et conformes à la réalité.
                </label>
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="transport_responsibility"
          render={({ field }) => (
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">
                  Je reconnais être seul(e) responsable des objets transportés dans cette tournée, et je m'engage à respecter toutes les lois et réglementations applicables au transport de marchandises.
                </label>
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="platform_rules"
          render={({ field }) => (
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">
                  J'ai lu et j'accepte les{" "}
                  <Link to="/cgu" className="text-primary hover:underline" target="_blank">
                    Conditions Générales d'Utilisation (CGU)
                  </Link>
                  {" "}ainsi que les règles de fonctionnement de la plateforme Colimero.
                </label>
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="safety_confirmation"
          render={({ field }) => (
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium">
                  Je comprends que je suis seul(e) responsable de la sécurité, du bon état et de la conformité des colis que je transporte dans cette tournée.
                </label>
              </div>
            </div>
          )}
        />
      </div>
    </FormSection>
  );
}