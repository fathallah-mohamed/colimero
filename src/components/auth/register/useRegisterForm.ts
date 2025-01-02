import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegisterForm(onLogin: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedConsents, setAcceptedConsents] = useState<string[]>([]);
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

    setIsLoading(true);

    try {
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
        const errorMessage = signUpError.message;
        if (errorMessage.includes("User already registered") || 
            signUpError.message === "User already registered" ||
            errorMessage.includes("already exists")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          });
          onLogin();
          return;
        }
        throw signUpError;
      }

      if (signUpData.user) {
        const { error: clientError } = await supabase
          .from('clients')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          })
          .eq('id', signUpData.user.id);

        if (clientError) throw clientError;

        // Insérer les consentements
        const consentsToInsert = acceptedConsents.map(consentId => ({
          client_id: signUpData.user!.id,
          consent_type_id: consentId,
          accepted: true,
          accepted_at: new Date().toISOString()
        }));

        const { error: consentsError } = await supabase
          .from('client_consents')
          .insert(consentsToInsert);

        if (consentsError) throw consentsError;

        toast({
          title: "Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter",
        });

        onLogin();
      }
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

  const handleConsentChange = (consentId: string, accepted: boolean) => {
    setAcceptedConsents(prev => 
      accepted 
        ? [...prev, consentId]
        : prev.filter(id => id !== consentId)
    );
  };

  return {
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptedConsents,
    handleConsentChange,
    handleSubmit,
  };
}