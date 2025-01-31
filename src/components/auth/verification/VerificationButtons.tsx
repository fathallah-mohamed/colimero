import { Button } from "@/components/ui/button";

interface VerificationButtonsProps {
  isActivating: boolean;
  isResending: boolean;
  onActivate: () => void;
  onResendEmail: () => void;
  onClose: () => void;
  activationCode: string;
}

export function VerificationButtons({ 
  isActivating, 
  isResending, 
  onActivate, 
  onResendEmail, 
  onClose,
  activationCode 
}: VerificationButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onActivate}
        disabled={isActivating || !activationCode}
        className="w-full"
      >
        {isActivating ? "Activation..." : "Activer mon compte"}
      </Button>

      <Button
        onClick={onResendEmail}
        disabled={isResending}
        variant="outline"
        className="w-full"
      >
        {isResending ? "Envoi en cours..." : "Renvoyer l'email d'activation"}
      </Button>

      <Button
        onClick={onClose}
        variant="ghost"
        className="w-full"
      >
        Fermer
      </Button>
    </div>
  );
}