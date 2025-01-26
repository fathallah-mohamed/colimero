import Navigation from "@/components/Navigation";
import { LoginFormContainer } from "@/components/auth/login/LoginFormContainer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', session.user.id)
          .single();

        // Ne rediriger que si l'utilisateur est vérifié ou n'est pas un client
        if (!clientData || clientData.email_verified) {
          navigate('/');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/creer-compte');
  };

  const handleCarrierRegister = () => {
    navigate('/devenir-transporteur');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-light py-16 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bienvenue sur votre espace personnel
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Connectez-vous pour accéder à vos expéditions, suivre vos colis en temps réel et gérer vos informations personnelles.
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="max-w-md mx-auto -mt-8 px-4 relative z-10 pb-16">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
          <LoginFormContainer
            onRegister={handleRegister}
            onCarrierRegister={handleCarrierRegister}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}