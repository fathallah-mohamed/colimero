import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useAccountActivation } from "@/hooks/auth/useAccountActivation";
import Navigation from "@/components/Navigation";

export default function AccountActivation() {
  const [email, setEmail] = useState<string>("");
  const [activationCode, setActivationCode] = useState("");
  const navigate = useNavigate();
  const { isLoading, error, sendActivationEmail, activateAccount } = useAccountActivation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
        return;
      }

      const { data: clientData } = await supabase
        .from('clients')
        .select('email, email_verified, status')
        .eq('id', session.user.id)
        .single();

      if (clientData?.email_verified || clientData?.status === 'active') {
        navigate('/');
        return;
      }

      setEmail(session.user.email || "");
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode) return;

    const success = await activateAccount(activationCode, email);
    if (success) {
      navigate('/');
    }
  };

  const handleResendEmail = async () => {
    await sendActivationEmail(email);
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 bg-blue-50 p-3 rounded-full inline-flex">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Activation de votre compte</h1>
            <p className="text-gray-600">
              Pour activer votre compte, veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
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
            </div>

            <p className="text-sm text-gray-500 text-center">
              Le code d'activation est valable pendant 48 heures
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}