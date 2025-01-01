import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

interface CommitmentStatusProps {
  accepted: boolean;
  description: string;
}

const CommitmentStatus = ({ accepted, description }: CommitmentStatusProps) => (
  <div className="space-y-2">
    <div className={`flex items-center ${accepted ? 'text-green-600' : 'text-red-600'} font-medium`}>
      {accepted ? (
        <Check className="w-5 h-5 mr-2 stroke-2" />
      ) : (
        <X className="w-5 h-5 mr-2 stroke-2" />
      )}
      <span>{accepted ? 'Accepté' : 'Non accepté'}</span>
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

interface CommitmentType {
  id: string;
  code: string;
  label: string;
  description: string;
}

interface CarrierCommitment {
  commitment_type_id: string;
  accepted: boolean;
  commitment_type: CommitmentType;
}

export function CommitmentsSection({ profile }: CommitmentsSectionProps) {
  const { data: commitments, isLoading } = useQuery({
    queryKey: ['carrier-commitments', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carrier_commitments')
        .select(`
          commitment_type_id,
          accepted,
          commitment_type:commitment_types(*)
        `)
        .eq('carrier_id', profile.id);

      if (error) throw error;
      return data as CarrierCommitment[];
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

  return (
    <div>
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Engagements</h2>
        <p className="text-sm text-gray-500 mt-1">
          Compte créé le {new Date(profile.created_at!).toLocaleDateString()}
        </p>
      </div>
      <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
        {commitments?.map((commitment) => (
          <div key={commitment.commitment_type_id}>
            <p className="text-sm text-gray-500 mb-2">{commitment.commitment_type.label}</p>
            <CommitmentStatus 
              accepted={commitment.accepted}
              description={commitment.commitment_type.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}