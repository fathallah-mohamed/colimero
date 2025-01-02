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
      // 1. Créer l'utilisateur dans auth.users
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: 'client'
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered") || 
            signUpError.message === "User already registered" ||
            signUpError.message.includes("already exists")) {
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
        // 2. Mettre à jour la table clients avec toutes les informations
        const { error: clientError } = await supabase
          .from('clients')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            birth_date: birthDate || null,
            address: address || null,
          })
          .eq('id', signUpData.user.id);

        if (clientError) throw clientError;

        // 3. Si un document d'identité a été fourni, le télécharger
        if (idDocument) {
          const fileExt = idDocument.name.split('.').pop();
          const fileName = `${signUpData.user.id}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('id-documents')
            .upload(fileName, idDocument);

          if (uploadError) throw uploadError;

          // Mettre à jour le champ id_document dans la table clients
          const { error: updateError } = await supabase
            .from('clients')
            .update({
              id_document: fileName
            })
            .eq('id', signUpData.user.id);

          if (updateError) throw updateError;
        }

        // 4. Insérer les consentements
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