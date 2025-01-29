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
  onVerificationNeeded
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { toast } = useToast();

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const createClientProfile = async (email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingClient } = await supabase
      .from('clients')
      .select('id, email_verified, activation_code')
      .eq('email', email)
      .maybeSingle();

    if (!existingClient) {
      const activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: user.id,
          email: email,
          status: 'pending',
          email_verified: false,
          activation_code: activationCode,
          activation_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        });

      if (insertError) {
        console.error('Error creating client profile:', insertError);
        return false;
      }

      // Envoyer l'email d'activation
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (emailError) {
        console.error('Error sending activation email:', emailError);
        return false;
      }

      return true;
    }

    return existingClient.email_verified;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      const normalizedEmail = normalizeEmail(email);

      // Vérifier le statut du client
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
        console.log('Client account needs verification:', email);
        const profileCreated = await createClientProfile(normalizedEmail);
        
        if (!profileCreated) {
          setError("Une erreur est survenue lors de la création du profil");
          setShowErrorDialog(true);
          return { success: false };
        }

        setShowVerificationDialog(true);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
        return { success: false, needsVerification: true };
      }

      // Tentative de connexion
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Email not confirmed')) {
          const profileCreated = await createClientProfile(normalizedEmail);
          if (profileCreated) {
            setShowVerificationDialog(true);
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
            return { success: false, needsVerification: true };
          }
        }
        setError(error.message);
        setShowErrorDialog(true);
        return { success: false, error: error.message };
      }

      if (!session) {
        setError("Erreur de connexion");
        setShowErrorDialog(true);
        return { success: false, error: "Erreur de connexion" };
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      }

      return { success: true };

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Une erreur est survenue");
      setShowErrorDialog(true);
      return { success: false, error: error.message };
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