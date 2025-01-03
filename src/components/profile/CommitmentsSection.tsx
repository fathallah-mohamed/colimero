import { useQuery } from "@tanstack/react-query";
import { Shield, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

interface CommitmentStatusProps {
  label: string;
  description: string;
}

function CommitmentStatus({ label, description }: CommitmentStatusProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center text-green-600">
          <Check className="w-4 h-4 mr-1" />
          <span className="text-sm">Accepté</span>
        </div>
      </div>
      <Alert>
        <AlertDescription className="text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface CommitmentsSectionProps {
  profile: ProfileData;
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
          commitment_type:commitment_types(
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
      return commitments;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Engagements acceptés</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-100 rounded-lg" />
          <div className="h-20 bg-gray-100 rounded-lg" />
          <div className="h-20 bg-gray-100 rounded-lg" />
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