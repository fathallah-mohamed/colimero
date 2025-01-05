import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  if (!consents?.length) return null;

  const handleRowClick = (onChange: (value: boolean) => void, currentValue: boolean) => {
    onChange(!currentValue);
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => handleRowClick(field.onChange, field.value)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    <div className="space-y-1 flex-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        {consent.label}
                        {getDocumentLink(consent.code) && (
                          <Link 
                            to={getDocumentLink(consent.code)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            (Voir le document)
                          </Link>
                        )}
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm text-muted-foreground">
                          {consent.description}
                        </AlertDescription>
                      </Alert>
                    </div>
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