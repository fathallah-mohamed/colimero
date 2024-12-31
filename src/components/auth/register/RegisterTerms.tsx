import { Checkbox } from "@/components/ui/checkbox";

interface RegisterTermsProps {
  termsAccepted: boolean;
  onTermsAcceptedChange: (checked: boolean) => void;
}

export function RegisterTerms({
  termsAccepted,
  onTermsAcceptedChange,
}: RegisterTermsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={termsAccepted}
        onCheckedChange={(checked) => onTermsAcceptedChange(checked as boolean)}
        defaultChecked
      />
      <label
        htmlFor="terms"
        className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Je déclare que toutes les informations fournies sont exactes et que je respecterai les lois en vigueur pour toute réservation effectuée via cette plateforme, en particulier concernant le contenu des colis.
      </label>
    </div>
  );
}