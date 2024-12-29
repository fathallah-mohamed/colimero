import Navigation from "@/components/Navigation";
import { LoginView } from "@/components/auth/carrier-auth/LoginView";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <LoginView 
          onForgotPassword={() => {}} 
          onRegister={() => {}}
        />
      </div>
    </div>
  );
}