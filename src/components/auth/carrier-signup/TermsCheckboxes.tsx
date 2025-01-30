import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";
import { Link } from "react-router-dom";
import type { FormValues } from "./FormSchema";

interface TermsCheckboxesProps {
  form: UseFormReturn<FormValues>;
}

export function TermsCheckboxes({ form }: TermsCheckboxesProps) {
  const { data: consents, isLoading } = useCarrierConsents();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-12 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  if (!consents?.length) return null;

  const getDocumentLink = (code: string) => {
    switch (code) {
      case 'carrier_terms':
        return '/cgu';
      case 'carrier_data_processing':
        return '/privacy';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {consents.map((consent) => {
        if (!consent.label || !consent.description) return null;
        
        return (
          <FormField
            key={consent.id}
            control={form.control}
            name={`consents.${consent.code}`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id={`consent-${consent.code}`}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label 
                        htmlFor={`consent-${consent.code}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {consent.label}
                      </label>
                      {getDocumentLink(consent.code) && (
                        <Link 
                          to={getDocumentLink(consent.code)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          (Voir le document)
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded-sm">
                      {consent.description}
                    </p>
                  </div>
                </div>
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}