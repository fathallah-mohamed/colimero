import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailVerificationDialog({ isOpen, onClose, email }: EmailVerificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Vérification de l'email requise</h2>
        <p className="text-gray-600">
          Un email de vérification a été envoyé à <span className="font-medium">{email}</span>.
          Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
        </p>
        <Button onClick={onClose} className="w-full">
          Fermer
        </Button>
      </div>
    </Dialog>
  );
}