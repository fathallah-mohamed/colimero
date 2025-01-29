import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVerification } from "@/hooks/auth/useVerification";
import { Loader2 } from "lucide-react";

export default function Activation() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [activationCode, setActivationCode] = useState("");
  const { isLoading, error, activateAccount, resendActivationEmail } = useVerification();

  useEffect(() => {
    if (!email) {
      navigate("/creer-compte");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await activateAccount(activationCode, email);
    if (success) {
      navigate("/connexion");
    }
  };

  const handleResendEmail = async () => {
    await resendActivationEmail(email);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Activation de votre compte</h1>
            <p className="text-gray-600">
              Veuillez entrer le code d'activation reçu par email à l'adresse{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Code d'activation"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !activationCode}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                "Activer mon compte"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">ou</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Recevoir un nouveau code"
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Le code d'activation est valable pendant 48 heures
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}