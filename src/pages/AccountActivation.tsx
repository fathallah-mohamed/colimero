import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ActivationForm } from "@/components/auth/ActivationForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

export default function AccountActivation() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/connexion');
        return;
      }

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email, email_verified, status')
        .eq('id', session.user.id)
        .single();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de votre compte."
        });
        return;
      }

      if (clientData?.email_verified && clientData?.status === 'active') {
        navigate('/', { replace: true });
        return;
      }

      setEmail(session.user.email || "");
    };

    checkSession();
  }, [navigate, toast]);

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        <div className="max-w-md mx-auto mt-20 px-4">
          <div className="text-center text-gray-600">
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto mt-20 px-4">
        <ActivationForm email={email} />
      </div>
    </div>
  );
}