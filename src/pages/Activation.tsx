import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";

interface ActivationProps {
  onShowAuthDialog?: () => void;
}

export default function Activation({ onShowAuthDialog }: ActivationProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
            
          if (clientData?.email) {
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
          setStatus('success');
          toast({
            title: "Compte déjà activé",
            description: "Votre compte a déjà été activé. Vous pouvez vous connecter.",
          });
          setTimeout(() => {
            if (mounted) {
              navigate('/');
              if (onShowAuthDialog) onShowAuthDialog();
            }
          }, 2000);
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
          setTimeout(() => {
            if (mounted) {
              navigate('/');
              if (onShowAuthDialog) onShowAuthDialog();
            }
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
  }, [token, navigate, toast, onShowAuthDialog]);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h2 className="text-xl font-semibold">Activation en cours...</h2>
              <p className="text-gray-500">Veuillez patienter pendant que nous activons votre compte.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-green-600">Compte activé !</h2>
              <p className="text-gray-500">
                Votre compte a été activé avec succès. Vous allez être redirigé...
              </p>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold text-amber-600">Lien expiré</h2>
              <p className="text-gray-500">
                Le lien d'activation a expiré. Vous pouvez demander un nouveau lien d'activation.
              </p>
              <Button 
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? "Envoi en cours..." : "Renvoyer le lien d'activation"}
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full mt-2"
              >
                Retourner à l'accueil
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-600">Erreur d'activation</h2>
              <p className="text-gray-500">
                Le lien d'activation est invalide. Veuillez réessayer ou contacter le support.
              </p>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Retourner à l'accueil
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}