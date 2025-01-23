import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

interface ForgotPasswordFormProps {
  onCancel?: () => void;
}

export function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email.trim())}`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: resetLink,
      });

      if (error) throw error;
      setShowConfirmation(true);
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemple@email.com"
            className="h-12"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien"
            )}
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              className="h-12" 
              onClick={onCancel}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          if (onCancel) onCancel();
        }}
        title="Email envoyé"
        message={`Si un compte existe avec l'adresse ${email}, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe. Pensez à vérifier vos spams si vous ne trouvez pas l'email dans votre boîte de réception.`}
      />
    </>
  );
}