import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Construire l'URL de réinitialisation avec l'origine actuel
      const resetLink = `${window.location.origin}/reset-password`;
      
      // Appeler l'API Supabase pour envoyer l'email de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: resetLink,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });

      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Mot de passe oublié ?</h2>
        <p className="text-sm text-gray-600 mt-2">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

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
  );
}