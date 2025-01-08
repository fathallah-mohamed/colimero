import { LoginForm } from "@/components/auth/LoginForm";
import Navigation from "@/components/Navigation";

export default function Connexion() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
          <LoginForm 
            onRegisterClick={() => window.location.href = '/inscription'}
            onCarrierRegisterClick={() => window.location.href = '/devenir-transporteur'}
          />
        </div>
      </div>
    </div>
  );
}