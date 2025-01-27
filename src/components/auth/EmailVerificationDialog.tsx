import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useVerification } from "@/hooks/auth/useVerification";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail: () => void;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  email,
  onResendEmail,
}: EmailVerificationDialogProps) {
  const [activationCode, setActivationCode] = useState("");
  const { isLoading, error, activateAccount, resendActivationEmail } = useVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode) return;

    const success = await activateAccount(activationCode, email);
    if (success) {
      onClose();
    }
  };

  const handleResendEmail = async () => {
    await resendActivationEmail(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Activation du compte
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-gray-600">
            Veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>
          </p>

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
      </DialogContent>
    </Dialog>
  );
}