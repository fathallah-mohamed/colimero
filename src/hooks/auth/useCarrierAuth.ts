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
    console.log('Checking carrier status for:', email);
    
    const { data, error } = await supabase
      .from('carriers')
      .select('status, email_verified')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error("Error checking carrier status:", error);
      throw error;
    }

    console.log('Carrier status data:', data);

    if (!data) {
      throw new Error("Ce compte n'est pas un compte transporteur");
    }

    if (data.status !== 'active') {
      let errorMessage = "Votre compte n'est pas actif.";
      if (data.status === 'pending') {
        errorMessage = "Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois votre compte validé.";
      } else if (data.status === 'rejected') {
        errorMessage = "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter.";
      }
      throw new Error(errorMessage);
    }

    return data;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, statusMessage: null }));
      console.log('Starting carrier login process for:', email);

      // Vérifier le statut du transporteur avant la connexion
      await checkCarrierStatus(email);

      // Si le statut est OK, procéder à la connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: error.message === "Invalid login credentials"
              ? "Email ou mot de passe incorrect"
              : "Une erreur est survenue lors de la connexion"
          }
        }));
        return;
      }

      // Double vérification du statut après la connexion
      const { data: carrierData } = await supabase
        .from('carriers')
        .select('status')
        .eq('id', data.user.id)
        .single();

      if (!carrierData || carrierData.status !== 'active') {
        // Déconnecter immédiatement si le statut n'est pas actif
        await supabase.auth.signOut();
        setState(prev => ({
          ...prev,
          statusMessage: {
            type: 'destructive',
            message: "Votre compte n'est pas actif. Veuillez contacter l'administrateur."
          }
        }));
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

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
          message: error.message || "Une erreur est survenue lors de la connexion"
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