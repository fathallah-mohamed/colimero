import { Checkbox } from "@/components/ui/checkbox";
import { useConsents } from "@/hooks/useConsents";
import { Skeleton } from "@/components/ui/skeleton";

interface RegisterTermsProps {
  acceptedConsents: string[];
  onConsentChange: (consentId: string, accepted: boolean) => void;
}

export function RegisterTerms({
  acceptedConsents,
  onConsentChange,
}: RegisterTermsProps) {
  const { consentTypes, isLoading } = useConsents();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-2">
            <Skeleton className="h-4 w-4 mt-1" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!consentTypes) {
    return null;
  }

  return (
    <div className="space-y-4">
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