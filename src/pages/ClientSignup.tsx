import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function ClientSignup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Créer un compte client
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Créez votre compte client pour commencer à expédier vos colis
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm onLogin={() => navigate("/connexion")} />
        </div>
      </div>
    </div>
  );
}