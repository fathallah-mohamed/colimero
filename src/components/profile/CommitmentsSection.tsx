import { Shield, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "@/types/profile";
import { CarrierCommitment } from "@/types/commitments";

interface CommitmentsSectionProps {
  profile: ProfileData;
}

interface CommitmentStatusProps {
  label: string;
  description: string;
}

function CommitmentStatus({ label, description }: CommitmentStatusProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">
        <Shield className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          <Check className="h-4 w-4 text-green-500" />
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export function CommitmentsSection({ profile }: CommitmentsSectionProps) {
  const { data: commitments, isLoading } = useQuery({
    queryKey: ['carrier-commitments', profile.id],
    queryFn: async () => {
      console.log("Fetching commitments for carrier:", profile.id);
      
      const { data: commitments, error: commitmentsError } = await supabase
        .from('carrier_commitments')
        .select(`
          accepted,
          commitment_type:commitment_types (
            id,
            label,
            description
          )
        `)
        .eq('carrier_id', profile.id)
        .eq('accepted', true);

      if (commitmentsError) {
        console.error("Error fetching commitments:", commitmentsError);
        throw commitmentsError;
      }
      
      console.log("Fetched commitments:", commitments);
      return commitments as CarrierCommitment[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
          <div className="h-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!commitments?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Engagements acceptés</h3>
      <div className="bg-gray-50/50 rounded-lg p-6 space-y-6 border border-gray-100">
        {commitments.map((commitment) => (
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