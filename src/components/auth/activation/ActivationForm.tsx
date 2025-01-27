import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivationFormProps {
  email?: string;
  onSuccess?: () => void;
}

export function ActivationForm({ email, onSuccess }: ActivationFormProps) {
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email manquant");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting activation with code:", activationCode);
      const result = await clientAuthService.activateAccount(activationCode, email);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Refresh the session after activation
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw sessionError;
      }

      if (!session) {
        // If no session, try to sign in again
        const { data: { session: newSession }, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: activationCode // Use activation code as temporary password
        });

        if (signInError) {
          console.error('Error signing in after activation:', signInError);
          throw signInError;
        }

        if (!newSession) {
          throw new Error('No session after activation');
        }
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error in activation:', error);
      setError("Une erreur est survenue lors de l'activation");
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

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !activationCode}
      >
        {isLoading ? "Activation..." : "Activer mon compte"}
      </Button>
    </form>
  );
}