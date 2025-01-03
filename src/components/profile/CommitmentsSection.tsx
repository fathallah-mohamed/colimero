import { useQuery } from "@tanstack/react-query";
import { Shield, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CommitmentStatusProps {
  description: string;
  label: string;
}

const CommitmentStatus = ({ description, label }: CommitmentStatusProps) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <div className="flex items-center text-green-600 font-medium">
        <Shield className="w-5 h-5 mr-2 stroke-2" />
        <span>{label}</span>
      </div>
      <div className="flex items-center text-green-600">
        <Check className="w-4 h-4 mr-1" />
        <span className="text-sm text-gray-600">Accepté</span>
      </div>
    </div>
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

export function CommitmentsSection({ profile }: CommitmentsSectionProps) {
  const { data: commitments, isLoading } = useQuery({
    queryKey: ['carrier-commitments', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carrier_commitments')
        .select(`
          accepted_at,
          commitment_type:commitment_types(*)
        `)
        .eq('carrier_id', profile.id)
        .eq('accepted', true)
        .order('accepted_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const acceptedAt = data?.[0]?.accepted_at;

      const { data: consents, error: consentsError } = await supabase
        .from('carrier_commitments')
        .select(`
          accepted,
          commitment_type:commitment_types(*)
        `)
        .eq('carrier_id', profile.id);

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
          <CommitmentStatus
            key={commitment.commitment_type.id}
            label={commitment.commitment_type.label}
            description={commitment.commitment_type.description}
          />
        ))}
      </div>
    </div>
  );
}