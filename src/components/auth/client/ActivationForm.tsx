import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivationFormProps {
  email?: string;
  onSuccess?: () => void;
}

export function ActivationForm({ email, onSuccess }: ActivationFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .rpc('activate_client_account', {
          p_activation_code: code.trim()
        });

      if (error) throw error;

      if (data) {
        toast({
          title: "Compte activé",
          description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/connexion');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Code invalide",
          description: "Le code d'activation est invalide ou a expiré.",
        });
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation de votre compte.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Code d'activation
        </label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Entrez votre code d'activation"
          className="text-center tracking-widest text-lg"
          maxLength={7}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || code.length < 6}
      >
        {isLoading ? "Activation..." : "Activer mon compte"}
      </Button>

      {email && (
        <p className="text-sm text-center text-gray-500">
          Un code d'activation a été envoyé à {email}
        </p>
      )}
    </form>
  );
}