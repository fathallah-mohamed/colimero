import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterFormProps {
  onLogin: () => void;
}

export function RegisterForm({ onLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez accepter les conditions pour continuer",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Créer le compte utilisateur avec les métadonnées
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            user_type: 'client'
          },
        },
      });

      if (signUpError) {
        if (signUpError.message === "User already registered") {
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          });
          onLogin();
          return;
        }
        throw signUpError;
      }

      // 2. Mettre à jour la table clients avec les informations supplémentaires
      if (signUpData.user) {
        const { error: clientError } = await supabase
          .from('clients')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('id', signUpData.user.id);

        if (clientError) throw clientError;
      }

      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });

      onLogin();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail">Email</Label>
        <Input
          id="registerEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPassword">Mot de passe</Label>
        <Input
          id="registerPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          defaultChecked
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Je déclare que toutes les informations fournies sont exactes et que je respecterai les lois en vigueur pour toute réservation effectuée via cette plateforme, en particulier concernant le contenu des colis.
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading || !termsAccepted}
      >
        {isLoading ? "Création en cours..." : "Créer mon compte"}
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onLogin}
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </form>
  );
}