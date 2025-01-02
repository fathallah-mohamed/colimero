import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CommitmentStatusProps {
  description: string;
}

const CommitmentStatus = ({ description }: CommitmentStatusProps) => (
  <div className="space-y-2">
    <Alert>
      <AlertDescription className="text-sm text-muted-foreground">
        {description}
      </AlertDescription>
    </Alert>
  </div>
);

interface CommitmentsSectionProps {
  profile: ProfileData;
}

interface CommitmentType {
  id: string;
  code: string;
  label: string;
  description: string;
}

interface CarrierCommitment {
  commitment_type_id: string;
  accepted: boolean;
  accepted_at: string;
  commitment_type: CommitmentType;
}

export function CommitmentsSection({ profile }: CommitmentsSectionProps) {
  const { data: commitments, isLoading } = useQuery({
    queryKey: ['carrier-commitments', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_consents')
        .select(`
          accepted_at,
          consent_type:client_consent_types(*)
        `)
        .eq('client_id', profile.id)
        .eq('accepted', true)
        .order('accepted_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const acceptedAt = data?.[0]?.accepted_at;

      const { data: consents, error: consentsError } = await supabase
        .from('client_consents')
        .select(`
          accepted,
          consent_type:client_consent_types(*)
        `)
        .eq('client_id', profile.id);

      if (consentsError) throw consentsError;
      
      return { consents, acceptedAt };
    },
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagements</h2>
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!commitments?.consents?.length) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Engagements</h2>
        {commitments.acceptedAt && (
          <p className="text-sm text-gray-500">
            Engagements acceptés le {format(new Date(commitments.acceptedAt), "d MMMM yyyy", { locale: fr })}
          </p>
        )}
      </div>
      <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
        {commitments.consents.map((commitment) => (
          <div key={commitment.consent_type.id}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{commitment.consent_type.label}</p>
              <div className="flex items-center text-green-600 font-medium">
                <Check className="w-5 h-5 mr-2 stroke-2" />
                <span>Accepté</span>
              </div>
            </div>
            <CommitmentStatus description={commitment.consent_type.description} />
          </div>
        ))}
      </div>
    </div>
  );
}