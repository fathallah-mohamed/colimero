import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClientLogin } from "@/hooks/auth/login/useClientLogin";

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
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  
  const {
    isLoading,
    error,
    handleLogin
  } = useClientLogin({
    onSuccess,
    onVerificationNeeded: () => setShowActivationDialog(true)
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
            {isLoading ? "Connexion..." : "Se connecter"}
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

      <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compte non activé</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Votre compte n'est pas encore activé. Un code d'activation a été envoyé à l'adresse <span className="font-medium">{email}</span>.
            </p>
            
            <p className="text-sm text-center text-gray-500">
              Si vous n'avez pas reçu le code, vous pouvez en demander un nouveau.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  handleLogin(email, password);
                  setShowActivationDialog(false);
                }}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? "Envoi..." : "Renvoyer le code"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}