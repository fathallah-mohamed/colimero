import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useRegisterForm(onLogin: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [acceptedConsents, setAcceptedConsents] = useState<string[]>([]);
  const { toast } = useToast();

  // Récupérer les types de consentements requis
  const { data: consentTypes } = useQuery({
    queryKey: ['client-consent-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_consent_types')
        .select('*')
        .eq('required', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Calculer le nombre de consentements requis et si tous sont acceptés
  const requiredConsentsCount = consentTypes?.length || 0;
  const allRequiredConsentsAccepted = acceptedConsents.length === requiredConsentsCount;

  const areRequiredFieldsFilled = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      allRequiredConsentsAccepted
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areRequiredFieldsFilled()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
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
            birth_date: birthDate || null,
            address: address || null,
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
    birthDate,
    setBirthDate,
    address,
    setAddress,
    idDocument,
    setIdDocument,
    acceptedConsents,
    handleConsentChange,
    handleSubmit,
    requiredConsentsCount,
    allRequiredConsentsAccepted,
    areRequiredFieldsFilled,
  };
}
