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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
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