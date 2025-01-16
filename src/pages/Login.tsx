import Navigation from "@/components/Navigation";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-light py-12 px-4">
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
      <div className="max-w-md mx-auto -mt-8 px-4 relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-8">
            Connexion
          </h2>
          <LoginForm
            onForgotPassword={() => navigate('/reset-password')}
            onRegister={handleRegister}
            onCarrierRegister={handleCarrierRegister}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}