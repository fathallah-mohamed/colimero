import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ 
  onSuccess,
  requiredUserType,
  onVerificationNeeded,
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      console.log('Checking client status for:', email);

      // 1. Tenter d'abord la connexion pour vérifier les identifiants
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError("Email ou mot de passe incorrect");
        setShowErrorDialog(true);
        return;
      }

      if (!authData.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // 2. Une fois connecté, vérifier le statut du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status, activation_code, activation_expires_at')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        throw new Error("Erreur lors de la vérification du compte");
      }

      // 3. Si le client existe et n'est pas vérifié ou est en attente
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log('Client not verified or pending:', clientData);
        
        // Vérifier si le code d'activation est expiré
        const isExpired = !clientData.activation_expires_at || new Date(clientData.activation_expires_at) < new Date();
        
        // Envoyer un nouvel email d'activation si pas de code ou code expiré
        if (!clientData.activation_code || isExpired) {
          console.log('No activation code or expired, sending new one...');
          const { error: functionError } = await supabase.functions.invoke(
            'send-activation-email',
            {
              body: { email: email.trim() }
            }
          );

          if (functionError) {
            console.error('Error sending activation email:', functionError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible d'envoyer l'email d'activation"
            });
          } else {
            toast({
              title: "Email envoyé",
              description: "Un nouvel email d'activation vous a été envoyé"
            });
          }
        }

        // Déconnecter l'utilisateur car le compte n'est pas activé
        await supabase.auth.signOut();
        
        setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        return;
      }

      // 4. Vérifier le type d'utilisateur si requis
      const userType = authData.user.user_metadata?.user_type as UserType;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  };
}