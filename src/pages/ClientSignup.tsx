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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-32 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <RegisterForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
}