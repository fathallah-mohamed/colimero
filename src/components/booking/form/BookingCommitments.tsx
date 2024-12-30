import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BookingCommitmentsProps {
  customsDeclaration: boolean;
  setCustomsDeclaration: (checked: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (checked: boolean) => void;
}

export function BookingCommitments({ 
  customsDeclaration, 
  setCustomsDeclaration,
  termsAccepted,
  setTermsAccepted
}: BookingCommitmentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="customs-declaration"
          checked={customsDeclaration}
          onCheckedChange={(checked) => setCustomsDeclaration(checked as boolean)}
          className="mt-1"
        />
        <Label
          htmlFor="customs-declaration"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Je déclare que le contenu de mon colis ne contient aucun objet interdit par la loi ou les règlements douaniers.
        </Label>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms-accepted"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          className="mt-1"
        />
        <Label
          htmlFor="terms-accepted"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          J'accepte les conditions générales d'utilisation et je comprends que cette réservation est soumise à l'approbation du transporteur.
        </Label>
      </div>
    </div>
  );
}