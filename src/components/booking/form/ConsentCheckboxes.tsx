import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useConsents } from "@/hooks/useConsents";

export function ConsentCheckboxes() {
  const { consentTypes, userConsents, isLoading, updateConsent } = useConsents();

  if (isLoading) {
    return <div>Chargement des consentements...</div>;
  }

  return (
    <div className="space-y-4">
      {consentTypes?.map((consentType) => {
        const userConsent = userConsents?.find(
          (consent) => consent.consentTypeId === consentType.id
        );

        return (
          <div key={consentType.id} className="flex items-start space-x-3">
            <Checkbox
              id={consentType.code}
              checked={userConsent?.accepted || false}
              onCheckedChange={(checked) =>
                updateConsent.mutate({
                  consentTypeId: consentType.id,
                  accepted: checked as boolean,
                })
              }
              className="mt-1"
            />
            <Label
              htmlFor={consentType.code}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {consentType.label}
              {consentType.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {consentType.description}
                </p>
              )}
            </Label>
          </div>
        );
      })}
    </div>
  );
}