import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SetupPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("Email manquant dans l'URL. Veuillez utiliser le lien fourni dans l'email.");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Email manquant. Veuillez utiliser le lien fourni dans l'email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      // Update password in auth
      const { error: updateError } = await supabase.auth.updateUser({ 
        password,
        email 
      });

      if (updateError) throw updateError;

      // Update password_changed status in carriers table
      const { error: updateCarrierError } = await supabase
        .from('carriers')
        .update({ password_changed: true })
        .eq('email', email);

      if (updateCarrierError) throw updateCarrierError;

      // Send confirmation emails
      await supabase.functions.invoke('send-password-setup-confirmation', {
        body: { 
          email,
          isCarrier: true
        }
      });

      toast({
        title: "Mot de passe configuré",
        description: "Votre mot de passe a été configuré avec succès. Vous pouvez maintenant vous connecter.",
      });

      navigate("/connexion");
    } catch (error: any) {
      console.error("Error setting up password:", error);
      setError(error.message || "Une erreur est survenue lors de la configuration du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !email) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="w-full mt-4"
          onClick={() => navigate("/connexion")}
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Configuration du mot de passe</h2>
          <p className="text-sm text-gray-600 mt-2">
            Configurez votre mot de passe pour accéder à votre compte transporteur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Entrez votre nouveau mot de passe"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirmez votre nouveau mot de passe"
                className="h-12"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configuration en cours...
              </>
            ) : (
              "Configurer le mot de passe"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}