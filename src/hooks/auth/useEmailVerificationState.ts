import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useEmailVerificationState(email: string) {
  const [isResending, setIsResending] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      console.log('Démarrage de la procédure d\'envoi d\'email pour:', email);
      setIsResending(true);

      // 1. Vérifier d'abord si le client existe et n'est pas déjà vérifié
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email)
        .single();

      if (clientError) {
        console.error('Erreur lors de la vérification du client:', clientError);
        throw new Error('Erreur lors de la vérification du compte');
      }

      if (clientData?.email_verified) {
        console.log('Le compte est déjà vérifié');
        toast({
          variant: "destructive",
          title: "Compte déjà activé",
          description: "Votre compte est déjà activé. Vous pouvez vous connecter.",
        });
        return;
      }

      // 2. Générer un nouveau token d'activation
      const { data: updateData, error: updateError } = await supabase
        .rpc('renew_activation_token', {
          p_email: email
        });

      if (updateError) {
        console.error('Erreur lors du renouvellement du token:', updateError);
        throw new Error('Erreur lors de la génération du token d\'activation');
      }

      console.log('Nouveau token généré avec succès');

      // 3. Envoyer l'email d'activation
      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email,
          firstName: 'Utilisateur' // Valeur par défaut si le prénom n'est pas disponible
        }
      });

      if (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        throw new Error('Erreur lors de l\'envoi de l\'email d\'activation');
      }

      console.log('Email d\'activation envoyé avec succès à:', email);
      
      // 4. Enregistrer l'envoi dans les logs
      await supabase
        .from('email_logs')
        .insert({
          email: email,
          status: 'sent',
          email_type: 'activation'
        });

      toast({
        title: "Email envoyé",
        description: "Un nouveau lien d'activation a été envoyé à votre adresse email.",
      });

    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    showVerificationDialog,
    setShowVerificationDialog,
    handleResendEmail
  };
}