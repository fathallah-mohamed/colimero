import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationDialogContentProps {
  email: string;
  isResending: boolean;
  onResendEmail: () => void;
  onClose: () => void;
}

export function VerificationDialogContent({
  email,
  isResending,
  onResendEmail,
  onClose,
}: VerificationDialogContentProps) {
  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-50 p-3 rounded-full">
          <Mail className="h-6 w-6 text-blue-500" />
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-center text-gray-600">
          Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail à l'adresse <span className="font-medium">{email}</span> et cliquer sur le lien d'activation.
        </p>
        
        <p className="text-sm text-center text-gray-500">
          Si vous n'avez pas reçu l'email, vérifiez vos spams ou cliquez sur le bouton ci-dessous pour recevoir un nouveau code.
        </p>

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
          Le code d'activation est valable pendant 48 heures
        </p>
      </div>
    </>
  );
}