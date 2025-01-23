import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get the email from the URL parameters
  const email = searchParams.get("email");

  useEffect(() => {
    // Verify that we have an email in the URL
    if (!email) {
      setError("Email manquant dans l'URL. Veuillez réessayer le processus de réinitialisation.");
      return;
    }

    // Verify that the token exists
    const accessToken = searchParams.get("token");
    if (!accessToken) {
      setError("Token de réinitialisation manquant. Veuillez réessayer le processus de réinitialisation.");
      return;
    }

    // Set the access token in Supabase
    const setAccessToken = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: accessToken,
      });

      if (error) {
        console.error("Error setting session:", error);
        setError("Le lien de réinitialisation est invalide ou a expiré. Veuillez réessayer.");
      }
    };

    setAccessToken();
  }, [email, searchParams]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Email manquant. Veuillez réessayer le processus de réinitialisation.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password,
        email: email // Include the email to ensure we're updating the correct user
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      // Rediriger vers la page de connexion
      setTimeout(() => {
        navigate("/connexion");
      }, 1500);

    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError(error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe");
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Réinitialisation du mot de passe</h2>
        <p className="text-sm text-gray-600 mt-2">
          Choisissez votre nouveau mot de passe pour le compte {email}
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
              minLength={6}
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
              minLength={6}
              placeholder="Confirmez votre nouveau mot de passe"
              className="h-12"
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Réinitialisation...
            </>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </Button>
      </form>
    </div>
  );
}