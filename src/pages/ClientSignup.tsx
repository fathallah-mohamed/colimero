import { RegisterForm } from "@/components/auth/RegisterForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function ClientSignup() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
    // Petit délai pour laisser le temps à la navigation de se faire
    setTimeout(() => {
      const loginButton = document.querySelector('[data-login-button]');
      if (loginButton instanceof HTMLElement) {
        loginButton.click();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Créez votre compte client
          </h1>
          <p className="text-lg text-gray-100 mb-8">
            Rejoignez notre communauté et commencez à expédier vos colis en toute simplicité
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto -mt-8 px-4 pb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <RegisterForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
}