import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface EngagementsSectionProps {
  userId: string;
  userType: 'client' | 'carrier';
  onEngagementsUpdate?: () => void;
}

export function EngagementsSection({ userId, userType, onEngagementsUpdate }: EngagementsSectionProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: consentTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["consentTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consent_types')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: userConsents, isLoading: isLoadingConsents } = useQuery({
    queryKey: ["userConsents", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
  });

  const updateConsents = useMutation({
    mutationFn: async () => {
      setIsUpdating(true);
      try {
        const consentsToUpdate = consentTypes?.map(type => ({
          user_id: userId,
          consent_type_id: type.id,
          accepted: true,
          accepted_at: new Date().toISOString()
        }));

        if (!consentsToUpdate) return;

        const { error } = await supabase
          .from('user_consents')
          .upsert(consentsToUpdate);

        if (error) throw error;

        // Mettre à jour aussi la table correspondante (clients ou carriers)
        const table = userType === 'client' ? 'clients' : 'carriers';
        const { error: updateError } = await supabase
          .from(table)
          .update({
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            ...(userType === 'carrier' ? {
              customs_terms_accepted: true,
              responsibility_terms_accepted: true
            } : {})
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        toast({
          title: "Succès",
          description: "Vos engagements ont été mis à jour avec succès",
        });

        onEngagementsUpdate?.();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour les engagements",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConsents"] });
    },
  });

  if (isLoadingTypes || isLoadingConsents) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const allConsentsAccepted = userConsents?.every(consent => consent.accepted) ?? false;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {consentTypes?.map((type) => {
          const isAccepted = userConsents?.some(
            consent => consent.consent_type_id === type.id && consent.accepted
          );
          const acceptedAt = userConsents?.find(
            consent => consent.consent_type_id === type.id
          )?.accepted_at;

          return (
            <div key={type.id} className="flex space-x-3 items-start border rounded-lg p-4">
              <Checkbox
                checked={isAccepted}
                disabled={isAccepted || isUpdating}
                className="mt-1"
              />
              <div className="space-y-1">
                <p className="font-medium">{type.label}</p>
                <p className="text-sm text-gray-600">{type.description}</p>
                {isAccepted && acceptedAt && (
                  <p className="text-xs text-gray-500">
                    Accepté le {new Date(acceptedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!allConsentsAccepted && (
        <div className="flex justify-end">
          <Button 
            onClick={() => updateConsents.mutate()}
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accepter tous les engagements
          </Button>
        </div>
      )}
    </div>
  );
}