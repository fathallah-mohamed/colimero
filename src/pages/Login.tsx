import Navigation from "@/components/Navigation";
import { ClientLoginForm } from "@/components/auth/client/ClientLoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userType = session.user.user_metadata?.user_type;
        
        if (userType === 'client') {
          const { data: clientData } = await supabase
            .from('clients')
            .select('email_verified, status')
            .eq('id', session.user.id)
            .single();

          if (!clientData?.email_verified || clientData?.status !== 'active') {
            navigate('/activation-compte');
            return;
          }
        }
        
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/creer-compte');
  };

  const handleForgotPassword = () => {
    navigate('/mot-de-passe-oublie');
  };

  const handleCarrierRegister = () => {
    navigate('/devenir-transporteur');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Connexion à votre compte
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Connectez-vous pour accéder à votre espace personnel et gérer vos envois
        </p>
      </div>

      {/* Login Form Section */}
      <div className="max-w-md mx-auto -mt-8 px-4 relative z-10 pb-16">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <ClientLoginForm
            onRegister={handleRegister}
            onCarrierRegister={handleCarrierRegister}
            onForgotPassword={handleForgotPassword}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}