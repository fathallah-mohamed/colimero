import { RegisterForm } from "@/components/auth/RegisterForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function ClientSignup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-32 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <RegisterForm onLogin={() => {
            navigate('/connexion');
          }} />
        </div>
      </div>
    </div>
  );
}