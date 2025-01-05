import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCarrierConsents } from "@/hooks/useCarrierConsents";
import { Link } from "react-router-dom";
import type { FormValues } from "./FormSchema";
import { Shield, FileText, User, PackageCheck } from "lucide-react";

interface TermsCheckboxesProps {
  form: UseFormReturn<FormValues>;
}

interface ConsentCategory {
  title: string;
  icon: React.ReactNode;
  codes: string[];
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

  const categories: ConsentCategory[] = [
    {
      title: "Informations générales",
      icon: <Shield className="h-5 w-5" />,
      codes: ['carrier_info_accuracy']
    },
    {
      title: "Responsabilités",
      icon: <PackageCheck className="h-5 w-5" />,
      codes: ['carrier_responsibility']
    },
    {
      title: "Documents contractuels",
      icon: <FileText className="h-5 w-5" />,
      codes: ['carrier_terms']
    },
    {
      title: "Données personnelles",
      icon: <User className="h-5 w-5" />,
      codes: ['carrier_data_processing']
    }
  ];

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
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryConsents = consents?.filter(
          consent => category.codes.includes(consent.code)
        );

        if (!categoryConsents?.length) return null;

        return (
          <div key={category.title} className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              {category.icon}
              <h3>{category.title}</h3>
            </div>
            <div className="space-y-6 pl-7">
              {categoryConsents.map((consent) => (
                <FormField
                  key={consent.id}
                  control={form.control}
                  name={`consents.${consent.code}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}