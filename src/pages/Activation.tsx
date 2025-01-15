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
    const activateAccount = async () => {
      if (!token) {
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erreur d'activation",
          description: "Token d'activation manquant",
        });
        return;
      }

      try {
        console.log('Tentative d\'activation avec le token:', token);

        // Récupérer le client avec le token d'activation
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('activation_token', token)
          .single();

        if (clientError || !client) {
          console.error('Erreur lors de la récupération du client:', clientError);
          throw new Error('Token invalide ou compte déjà activé');
        }

        console.log('Client trouvé:', client);

        // Vérifier si le token n'a pas expiré
        if (new Date(client.activation_expires_at) < new Date()) {
          throw new Error('Le lien d\'activation a expiré');
        }

        // Mettre à jour le statut de vérification du client
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            email_verified: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq('id', client.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du client:', updateError);
          throw updateError;
        }

        // Mettre à jour les métadonnées de l'utilisateur dans auth.users
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { email_verified: true }
        });

        if (authUpdateError) {
          console.error('Erreur lors de la mise à jour des métadonnées:', authUpdateError);
          throw authUpdateError;
        }

        console.log('Compte activé avec succès');
        setStatus('success');
        toast({
          title: "Compte activé",
          description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
        });

        // Rediriger après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (error: any) {
        console.error('Erreur d\'activation:', error);
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Erreur d'activation",
          description: error.message || "Une erreur est survenue lors de l'activation",
        });
      }
    };

    activateAccount();
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
                Votre compte a été activé avec succès. Vous allez être redirigé vers la page d'accueil...
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
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
                Le lien d'activation est invalide ou a expiré. Veuillez réessayer ou contacter le support.
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