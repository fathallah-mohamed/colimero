import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Activation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          toast({
            variant: "destructive",
            title: "Token manquant",
            description: "Le lien d'activation est invalide.",
          });
          navigate("/");
          return;
        }

        const { data: client, error: fetchError } = await supabase
          .from("clients")
          .select("*")
          .eq("activation_token", token)
          .single();

        if (fetchError || !client) {
          toast({
            variant: "destructive",
            title: "Erreur d'activation",
            description: "Le lien d'activation est invalide ou a expiré.",
          });
          navigate("/");
          return;
        }

        if (client.is_activated) {
          toast({
            title: "Compte déjà activé",
            description: "Votre compte est déjà activé. Vous pouvez vous connecter.",
          });
          navigate("/");
          return;
        }

        const now = new Date();
        const expiresAt = new Date(client.activation_expires_at);
        if (now > expiresAt) {
          toast({
            variant: "destructive",
            title: "Lien expiré",
            description: "Le lien d'activation a expiré. Veuillez vous réinscrire.",
          });
          navigate("/");
          return;
        }

        const { error: updateError } = await supabase
          .from("clients")
          .update({ 
            is_activated: true,
            activation_token: null,
            activation_expires_at: null
          })
          .eq("id", client.id);

        if (updateError) {
          throw updateError;
        }

        setIsActivated(true);
        toast({
          title: "Compte activé",
          description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
        });
      } catch (error) {
        console.error("Error activating account:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'activation de votre compte.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Activation de votre compte
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isActivated ? (
          <div className="space-y-4">
            <p className="text-center text-green-600">
              Votre compte a été activé avec succès !
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate("/")}>
                Retourner à l'accueil
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">
            Une erreur est survenue lors de l'activation de votre compte.
          </div>
        )}
      </div>
    </div>
  );
}