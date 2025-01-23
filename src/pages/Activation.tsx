import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ActivationProps {
  onShowAuthDialog?: () => void;
}

export default function Activation({ onShowAuthDialog }: ActivationProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    let mounted = true;
    
    const activateAccount = async () => {
      if (!token) {
        console.log('No activation token found in URL');
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

        // 1. Vérifier si le token est valide et n'a pas expiré
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id, email, email_verified, activation_expires_at')
          .eq('activation_token', token)
          .single();

        console.log('Client query result:', { client, clientError });

        if (clientError || !client) {
          console.error('Error fetching client:', clientError);
          throw new Error("Token invalide ou compte introuvable");
        }

        console.log('Client found:', client);

        // Vérifier si le token a expiré
        if (client.activation_expires_at && new Date(client.activation_expires_at) < new Date()) {
          console.error('Token expired:', client.activation_expires_at);
          throw new Error("Le token d'activation a expiré");
        }

        // 2. Vérifier si le compte est déjà activé
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

        // 3. Mettre à jour le statut de vérification du client
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            email_verified: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq('id', client.id);

        if (updateError) {
          console.error('Error updating client verification status:', updateError);
          throw updateError;
        }

        console.log('Client verification status updated successfully');

        // 4. Mettre à jour les métadonnées de l'utilisateur dans auth.users
        const { error: userUpdateError } = await supabase.auth.updateUser({
          data: { email_verified: true }
        });

        if (userUpdateError) {
          console.error('Error updating auth user metadata:', userUpdateError);
          throw userUpdateError;
        }

        console.log('Auth user metadata updated successfully');

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

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-600">Erreur d'activation</h2>
              <p className="text-gray-500">
                Le lien d'activation est invalide ou a expiré. Veuillez réessayer ou contacter le support.
              </p>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Retourner à la page d'accueil
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}