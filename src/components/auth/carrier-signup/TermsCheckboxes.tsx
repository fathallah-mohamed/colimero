import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./FormSchema";

interface TermsCheckboxesProps {
  form: UseFormReturn<FormValues>;
}

export function TermsCheckboxes({ form }: TermsCheckboxesProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="terms_accepted"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex flex-row items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conditions générales
              </label>
            </div>
            <Alert>
              <AlertDescription className="text-sm text-muted-foreground">
                Je certifie que toutes les informations fournies sont exactes et je m'engage à respecter les conditions générales d'utilisation de la plateforme.
              </AlertDescription>
            </Alert>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customs_terms_accepted"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex flex-row items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conditions douanières
              </label>
            </div>
            <Alert>
              <AlertDescription className="text-sm text-muted-foreground">
                Je m'engage à respecter toutes les réglementations douanières en vigueur et à déclarer correctement tous les colis transportés lors des passages aux frontières.
              </AlertDescription>
            </Alert>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="responsibility_terms_accepted"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex flex-row items-start space-x-3">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Responsabilité des objets transportés
              </label>
            </div>
            <Alert>
              <AlertDescription className="text-sm text-muted-foreground">
                Je reconnais être entièrement responsable des objets transportés pendant toute la durée de leur prise en charge, de leur collecte jusqu'à leur livraison.
              </AlertDescription>
            </Alert>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}