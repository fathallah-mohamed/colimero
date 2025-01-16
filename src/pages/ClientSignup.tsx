import { RegisterForm } from "@/components/auth/RegisterForm";
import Navigation from "@/components/Navigation";

export default function ClientSignup() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-32 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <RegisterForm onLogin={() => {
            window.location.href = '/connexion';
          }} />
        </div>
      </div>
    </div>
  );
}