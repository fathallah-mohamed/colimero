import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEmailVerification } from "./useEmailVerification";

export function useActivation(token: string | null) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { verifyEmail, isVerifying, showConfirmationDialog, setShowConfirmationDialog, resendActivationEmail } = useEmailVerification();

  useEffect(() => {
    let mounted = true;
    
    const activateAccount = async () => {
      if (!token) {
        console.error("No activation token found in URL");
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erreur d'activation",
          description: "Token d'activation manquant",
        });
        return;
      }

      try {
        console.log('Starting account activation with token:', token);

        const { data: isExpired } = await supabase
          .rpc('is_activation_token_expired', { token });

        if (isExpired) {
          console.log('Token expired');
          const { data: clientData } = await supabase
            .from('clients')
            .select('email')
            .eq('activation_token', token)
            .maybeSingle();
            
          if (clientData?.email && mounted) {
            setEmail(clientData.email);
          }
          
          setStatus('expired');
          return;
        }

        const { error: updateError } = await supabase
          .from('clients')
          .update({
            email_verified: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq('activation_token', token);

        if (updateError) throw updateError;

        if (mounted) {
          setStatus('success');
          toast({
            title: "Compte activé",
            description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
          });
          setTimeout(() => {
            navigate('/connexion');
          }, 2000);
        }

      } catch (error: any) {
        console.error('Account activation failed:', error);
        if (mounted) {
          setStatus('error');
          toast({
            variant: "destructive",
            title: "Erreur d'activation",
            description: error.message || "Une erreur est survenue lors de l'activation",
          });
        }
      }
    };

    activateAccount();

    return () => {
      mounted = false;
    };
  }, [token, toast, navigate]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    const success = await resendActivationEmail(email);
    if (success) {
      toast({
        title: "Email envoyé",
        description: "Un nouveau lien d'activation vous a été envoyé par email.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le lien d'activation. Veuillez réessayer plus tard.",
      });
    }
  };

  return {
    status,
    email,
    isVerifying,
    handleResendEmail,
    showConfirmationDialog,
    setShowConfirmationDialog
  };
}