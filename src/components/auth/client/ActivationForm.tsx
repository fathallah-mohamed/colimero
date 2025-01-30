import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ActivationFormProps {
  email?: string;
  onSuccess?: () => void;
}

export function ActivationForm({ email, onSuccess }: ActivationFormProps) {
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting to activate account with code:', activationCode);
      const result = await clientAuthService.activateAccount(activationCode, email);

      if (!result.success) {
        setError(result.error);
        return;
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
      });

      // Rediriger vers la page de connexion
      navigate('/connexion');

    } catch (error: any) {
      console.error('Error in activation:', error);
      setError("Une erreur est survenue lors de l'activation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const { error: resendError } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (resendError) throw resendError;

      toast({
        title: "Code envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email."
      });
    } catch (error) {
      console.error('Error resending code:', error);
      setError("Impossible d'envoyer le code d'activation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Input
          type="text"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          placeholder="Entrez le code d'activation"
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !activationCode}
        >
          {isLoading ? "Activation..." : "Activer mon compte"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResendCode}
          disabled={isLoading}
        >
          Renvoyer le code
        </Button>
      </div>
    </form>
  );
}