import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: resetLink,
      });

      if (error) {
        console.error("Erreur de réinitialisation:", error);
        throw error;
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

      if (onSuccess) {
        onSuccess();
      }
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
        description: "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.",
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
            className="h-12"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={onCancel}
          >
            Retour
          </Button>
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </div>
      </form>
    </div>
  );
}