import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  isResending: boolean;
  onResendEmail: () => void;
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  isResending,
  onResendEmail
}: EmailVerificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-blue-50 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Compte non activé</h2>
          <p className="text-gray-600">
            Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail à l'adresse <span className="font-medium">{email}</span> et cliquer sur le lien d'activation.
          </p>
          <p className="text-sm text-gray-500">
            Si vous n'avez pas reçu l'email, vérifiez vos spams ou cliquez sur le bouton ci-dessous pour recevoir un nouveau lien.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={isResending}
          >
            {isResending ? "Envoi en cours..." : "Renvoyer l'email d'activation"}
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