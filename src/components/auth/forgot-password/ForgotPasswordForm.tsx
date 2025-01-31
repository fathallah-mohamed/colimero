import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

interface ForgotPasswordFormProps {
  onCancel?: () => void;
}

export function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    if (onCancel) onCancel();
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Entrez votre adresse email. Si un compte existe avec cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe.
        </p>

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
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Email envoyé"
        message={`Si un compte existe avec l'adresse ${email}, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe. Pensez à vérifier vos spams si vous ne trouvez pas l'email dans votre boîte de réception.`}
      />
    </>
  );
}