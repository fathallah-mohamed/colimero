import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ConsentType, UserConsent } from "@/types/consent";

export function useConsents() {
  const queryClient = useQueryClient();

  const { data: consentTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["consentTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consent_types")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ConsentType[];
    },
  });

  const { data: userConsents, isLoading: isLoadingConsents } = useQuery({
    queryKey: ["userConsents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_consents")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as UserConsent[];
    },
  });

  const updateConsent = useMutation({
    mutationFn: async ({ consentTypeId, accepted }: { consentTypeId: string; accepted: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_consents")
        .upsert({
          user_id: user.id,
          consent_type_id: consentTypeId,
          accepted,
          accepted_at: accepted ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConsents"] });
    },
  });

  return {
    consentTypes,
    userConsents,
    isLoading: isLoadingTypes || isLoadingConsents,
    updateConsent,
  };
}