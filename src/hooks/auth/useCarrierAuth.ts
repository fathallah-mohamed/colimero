import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CarrierAuthState {
  isLoading: boolean;
  statusMessage: { type: 'default' | 'destructive'; message: string } | null;
}

export function useCarrierAuth(onSuccess?: () => void) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<CarrierAuthState>({
    isLoading: false,
    statusMessage: null,
  });

  const checkCarrierStatus = async (email: string) => {
    console.log("Checking carrier status for:", email);
    const { data: carrierData, error: carrierError } = await supabase
      .from('carriers')
      .select('status')
      .eq('email', email.trim())
      .single();

    if (carrierError && carrierError.code !== 'PGRST116') {
      console.error("Error checking carrier status:", carrierError);
      return { error: "Une erreur est survenue lors de la vérification de votre compte." };
    }

    if (carrierData) {
      if (carrierData.status === 'pending') {
        return { error: "Votre compte est en attente de validation par Colimero. Vous recevrez un email une fois votre compte validé." };
      }
      if (carrierData.status === 'rejected') {
        return { error: "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter." };
      }
      if (carrierData.status !== 'active') {
        return { error: "Votre compte n'est pas actif. Veuillez contacter l'administrateur." };
      }
    }

    return { success: true };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, statusMessage: null }));

      const statusCheck = await checkCarrierStatus(email);
      if ('error' in statusCheck) {
        setState(prev => ({
          ...prev,
          statusMessage: { type: 'default', message: statusCheck.error }
        }));
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: signInError.message === "Invalid login credentials"
              ? "Email ou mot de passe incorrect"
              : "Une erreur est survenue lors de la connexion"
          }
        }));
        return;
      }

      const { data: finalCheck, error: finalCheckError } = await supabase
        .from('carriers')
        .select('status')
        .eq('email', email)
        .single();

      if (finalCheckError || !finalCheck) {
        await supabase.auth.signOut();
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: "Vous n'avez pas les autorisations nécessaires pour vous connecter en tant que transporteur."
          }
        }));
        return;
      }

      if (finalCheck.status !== 'active') {
        await supabase.auth.signOut();
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: "Votre compte n'est pas actif. Veuillez attendre la validation de votre compte."
          }
        }));
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setState(prev => ({
        ...prev,
        statusMessage: {
          type: 'destructive',
          message: "Une erreur est survenue lors de la connexion"
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleLogin,
  };
}