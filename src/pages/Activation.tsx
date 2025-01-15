import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function Activation() {
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

        // 1. Récupérer le client avec le token d'activation
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id, email, email_verified')
          .eq('activation_token', token)
          .single();

        if (clientError || !client) {
          console.error('Error fetching client:', clientError);
          throw new Error('Token invalide ou compte introuvable');
        }

        console.log('Client found:', client);

        // 2. Vérifier si le compte est déjà activé
        if (client.email_verified) {
          console.log('Account already verified');
          setStatus('success');
          toast({
            title: "Compte déjà activé",
            description: "Votre compte a déjà été activé. Vous pouvez vous connecter.",
          });
          setTimeout(() => mounted && navigate('/connexion'), 3000);
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
          .eq('id', client.id)
          .select();

        if (updateError) {
          console.error('Error updating client verification status:', updateError);
          throw updateError;
        }

        console.log('Client verification status updated successfully');

        // 4. Mettre à jour les métadonnées de l'utilisateur dans auth.users via une fonction RPC
        const { error: rpcError } = await supabase.rpc('sync_user_verification', {
          user_id: client.id,
          is_verified: true
        });

        if (rpcError) {
          console.error('Error updating auth user metadata:', rpcError);
          throw rpcError;
        }

        console.log('Auth user metadata updated successfully');

        if (mounted) {
          setStatus('success');
          toast({
            title: "Compte activé",
            description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
          });
          setTimeout(() => mounted && navigate('/connexion'), 3000);
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
  }, [token, navigate, toast]);

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
                Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion...
              </p>
              <Button 
                onClick={() => navigate('/connexion')}
                className="w-full"
              >
                Aller à la page de connexion
              </Button>
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
                onClick={() => navigate('/connexion')}
                variant="outline"
                className="w-full"
              >
                Retourner à la page de connexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}