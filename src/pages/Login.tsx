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
      <div className="max-w-md mx-auto pt-32 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-8">
            Connexion
          </h1>
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