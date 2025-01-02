import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConsentValidation(acceptedConsents: string[]) {
  const { data: consentTypes } = useQuery({
    queryKey: ['client-consent-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_consent_types')
        .select('*')
        .eq('required', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const requiredConsentsCount = consentTypes?.length || 0;
  const allRequiredConsentsAccepted = acceptedConsents.length === requiredConsentsCount;

  return {
    requiredConsentsCount,
    allRequiredConsentsAccepted,
  };
}