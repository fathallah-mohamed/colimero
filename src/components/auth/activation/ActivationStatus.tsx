import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ActivationStatusProps {
  status: 'loading' | 'success' | 'error' | 'expired';
  email?: string | null;
  onResendEmail?: () => void;
  isResending?: boolean;
}

export function ActivationStatus({ 
  status, 
  email, 
  onResendEmail,
  isResending 
}: ActivationStatusProps) {
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Activation en cours...</h2>
            <p className="text-gray-500">
              Veuillez patienter pendant que nous activons votre compte.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-green-600">Compte activé !</h2>
            <p className="text-gray-500">
              Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <Button asChild className="w-full">
              <Link to="/connexion">Se connecter</Link>
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold text-amber-600">Lien expiré</h2>
            <p className="text-gray-500">
              Le lien d'activation a expiré. Vous pouvez demander un nouveau lien d'activation.
            </p>
            {email && (
              <Button 
                onClick={onResendEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? "Envoi en cours..." : "Renvoyer le lien d'activation"}
              </Button>
            )}
            <Button 
              variant="outline"
              asChild
              className="w-full"
            >
              <Link to="/">Retourner à l'accueil</Link>
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-red-600">Erreur d'activation</h2>
            <p className="text-gray-500">
              Le lien d'activation est invalide. Veuillez réessayer ou contacter le support.
            </p>
            <Button 
              variant="outline"
              asChild
              className="w-full"
            >
              <Link to="/">Retourner à l'accueil</Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}