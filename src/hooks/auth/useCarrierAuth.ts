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

  const checkUserType = async (email: string) => {
    console.log('Checking user type for:', email);
    
    // Vérifier d'abord si c'est un admin
    const { data: adminData } = await supabase
      .from('administrators')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (adminData) {
      return { error: "Ce compte est un compte administrateur. Veuillez utiliser la connexion administrateur." };
    }

    // Vérifier si c'est un client
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (clientData) {
      return { error: "Ce compte est un compte client. Veuillez utiliser la connexion client." };
    }

    // Vérifier le statut du transporteur
    const { data: carrierData } = await supabase
      .from('carriers')
      .select('status, id')
      .eq('email', email.trim())
      .maybeSingle();

    console.log('Carrier data:', carrierData);

    if (!carrierData) {
      return { error: "Aucun compte transporteur trouvé avec cet email." };
    }

    if (carrierData.status === 'pending') {
      return { error: "Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois votre compte validé." };
    }

    if (carrierData.status === 'rejected') {
      return { error: "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter." };
    }

    if (carrierData.status !== 'active') {
      return { error: "Votre compte n'est pas actif. Veuillez contacter l'administrateur." };
    }

    return { success: true, carrierId: carrierData.id };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setState(prev => ({ ...prev, isLoading: true, statusMessage: null }));

      // Vérifier d'abord le type et le statut de l'utilisateur
      const userCheck = await checkUserType(email);
      console.log('User check result:', userCheck);
      
      if ('error' in userCheck) {
        setState(prev => ({
          ...prev,
          statusMessage: { type: 'destructive', message: userCheck.error }
        }));
        return;
      }

      // Procéder à la connexion uniquement si la vérification est réussie
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
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

      // Vérifier à nouveau le statut après la connexion
      const { data: carrierData } = await supabase
        .from('carriers')
        .select('status')
        .eq('id', session?.user.id)
        .single();

      if (!carrierData || carrierData.status !== 'active') {
        // Si le statut n'est pas actif, déconnecter l'utilisateur
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