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
        return;
      }

      try {
        // Vérifier le token et la date d'expiration
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('activation_token', token)
          .maybeSingle();

        if (clientError || !client) {
          throw new Error('Token invalide');
        }

        // Vérifier si le token n'a pas expiré
        if (new Date(client.activation_expires_at) < new Date()) {
          throw new Error('Le lien d\'activation a expiré');
        }

        // Mettre à jour le statut de vérification
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            email_verified: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq('id', client.id);

        if (updateError) {
          throw updateError;
        }

        setStatus('success');
        toast({
          title: "Compte activé",
          description: "Votre compte a été activé avec succès",
        });

        // Rediriger après 3 secondes
        setTimeout(() => {
          navigate('/envoyer-colis');
        }, 3000);

      } catch (error) {
        console.error('Activation error:', error);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
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
              <p className="text-gray-500">Votre compte a été activé avec succès. Vous allez être redirigé...</p>
              <Button 
                onClick={() => navigate('/envoyer-colis')}
                className="mt-4"
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
                className="mt-4"
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