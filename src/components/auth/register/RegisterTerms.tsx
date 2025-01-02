import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RegisterTermsProps {
  acceptedConsents: string[];
  onConsentChange: (consentId: string, accepted: boolean) => void;
}

export function RegisterTerms({
  acceptedConsents,
  onConsentChange,
}: RegisterTermsProps) {
  const { data: consentTypes, isLoading } = useQuery({
    queryKey: ['client-consent-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_consent_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !consentTypes) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
      {consentTypes.map((consent) => (
        <div key={consent.id} className="flex items-start space-x-2">
          <Checkbox
            id={consent.id}
            checked={acceptedConsents.includes(consent.id)}
            onCheckedChange={(checked) => onConsentChange(consent.id, checked as boolean)}
            className="mt-1"
          />
          <p
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: consent.description }}
          />
        </div>
      ))}
    </div>
  );
}