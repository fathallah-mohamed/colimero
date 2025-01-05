import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CarrierConsent {
  id: string;
  code: string;
  label: string;
  description: string;
  required: boolean;
}

export function useCarrierConsents() {
  return useQuery({
    queryKey: ["carrier-consents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consent_types")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as CarrierConsent[];
    },
  });
}