import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

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
      const trimmedEmail = email.trim();
      const resetLink = `${window.location.origin}/reset-password`;

      // First, try to send the reset email through Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: resetLink,
      });

      if (error) {
        console.error("Erreur de réinitialisation Supabase:", error);
        
        // If Supabase fails, try our custom email function
        const response = await supabase.functions.invoke('send-reset-email', {
          body: {
            email: trimmedEmail,
            resetLink,
          }
        });

        if ('error' in response) {
          console.error("Erreur de la fonction d'envoi d'email:", response.error);
          throw new Error(response.error || "Erreur lors de l'envoi de l'email");
        }
      }

      // Log success
      await supabase.from('email_logs').insert([
        {
          email: trimmedEmail,
          status: 'success',
          email_type: 'password_reset'
        }
      ]);

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      // Log the error
      await supabase.from('email_logs').insert([
        {
          email: email.trim(),
          status: 'error',
          error_message: error.message,
          email_type: 'password_reset'
        }
      ]);

      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Retour
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </div>
      </form>
    </div>
  );
}