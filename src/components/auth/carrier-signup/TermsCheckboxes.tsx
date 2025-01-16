import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import type { FormValues } from "./FormSchema";

interface TermsCheckboxesProps {
  form: UseFormReturn<FormValues>;
}

export function TermsCheckboxes({ form }: TermsCheckboxesProps) {
  const { data: consents, isLoading } = useCarrierConsents();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-16 bg-gray-100 rounded" />
          </div>
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
    <div className="space-y-6">
      {consents.map((consent) => {
        if (!consent.label || !consent.description) return null;
        
        return (
          <FormField
            key={consent.id}
            control={form.control}
            name={`consents.${consent.code}`}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div 
                  className="flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                  onClick={() => field.onChange(!field.value)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Shield className={`h-5 w-5 ${field.value ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id={`consent-${consent.code}`}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label 
                          htmlFor={`consent-${consent.code}`}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {consent.label}
                        </label>
                      </div>
                      {getDocumentLink(consent.code) && (
                        <Link 
                          to={getDocumentLink(consent.code)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-hover text-sm font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir le document
                        </Link>
                      )}
                    </div>
                    <Alert className="bg-gray-50/80 border-gray-100">
                      <AlertDescription className="text-sm text-gray-600">
                        {consent.description}
                      </AlertDescription>
                    </Alert>
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