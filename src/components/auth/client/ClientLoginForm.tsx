import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmailVerificationDialog } from "../EmailVerificationDialog";
import { useClientAuth } from "@/hooks/auth/useClientAuth";
import { Loader2 } from "lucide-react";

interface ClientLoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

export function ClientLoginForm({
  onRegister,
  onForgotPassword,
  onSuccess
}: ClientLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  
  const {
    isLoading,
    error,
    handleLogin,
    handleResendActivation
  } = useClientAuth({
    onSuccess,
    onVerificationNeeded: () => setShowVerificationDialog(true)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="flex flex-col space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={onRegister}
              className="text-[#00B0F0] hover:underline"
            >
              Créer un compte
            </button>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#00B0F0] hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </form>

      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        email={email}
        onResendEmail={() => handleResendActivation(email)}
      />
    </>
  );
}