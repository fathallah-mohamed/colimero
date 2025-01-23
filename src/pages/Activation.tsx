import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";
import { ActivationStatus } from "@/components/auth/activation/ActivationStatus";

export default function Activation() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const token = searchParams.get('token');
  const { isResending, resendActivationEmail } = useEmailVerification();

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

        // 1. Vérifier si le token est expiré
        const { data: isExpired } = await supabase
          .rpc('is_activation_token_expired', { token });

        if (isExpired) {
          console.log('Token expired');
          // Récupérer l'email associé au token pour permettre le renvoi
          const { data: clientData } = await supabase
            .from('clients')
            .select('email')
            .eq('activation_token', token)
            .single();
            
          if (clientData?.email && mounted) {
            setEmail(clientData.email);
          }
          
          setStatus('expired');
          toast({
            variant: "destructive",
            title: "Token expiré",
            description: "Le lien d'activation a expiré. Veuillez demander un nouveau lien.",
          });
          return;
        }

        // 2. Récupérer les informations du client
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id, email, email_verified')
          .eq('activation_token', token)
          .single();

        if (clientError || !client) {
          console.error('Error fetching client:', clientError);
          throw new Error("Token invalide ou compte introuvable");
        }

        console.log('Client found:', client);

        // 3. Vérifier si le compte est déjà activé
        if (client.email_verified) {
          console.log('Account already verified');
          if (mounted) {
            setStatus('success');
            toast({
              title: "Compte déjà activé",
              description: "Votre compte a déjà été activé. Vous pouvez vous connecter.",
            });
          }
          return;
        }

        // 4. Activer le compte
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            email_verified: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq('id', client.id);

        if (updateError) throw updateError;

        // 5. Mettre à jour les métadonnées de l'utilisateur
        const { error: userUpdateError } = await supabase.auth.updateUser({
          data: { email_verified: true }
        });

        if (userUpdateError) throw userUpdateError;

        if (mounted) {
          setStatus('success');
          toast({
            title: "Compte activé",
            description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
          });
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
  }, [token, toast]);

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

  return (
    <ActivationStatus 
      status={status}
      email={email}
      onResendEmail={handleResendEmail}
      isResending={isResending}
    />
  );
}