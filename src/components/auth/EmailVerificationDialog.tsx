import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";
import { Mail } from "lucide-react";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailVerificationDialog({ isOpen, onClose, email }: EmailVerificationDialogProps) {
  const { isResending, resendActivationEmail } = useEmailVerification();

  const handleResendEmail = async () => {
    await resendActivationEmail(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-blue-50 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Vérification de l'email requise</h2>
          <p className="text-gray-600">
            Un email de vérification a été envoyé à <span className="font-medium">{email}</span>.
            Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={isResending}
          >
            {isResending ? "Envoi en cours..." : "Renvoyer l'email"}
          </Button>
          
          <Button onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Le lien d'activation est valable pendant 48 heures
        </p>
      </div>
    </Dialog>
  );
}