import Navigation from "@/components/Navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <RegisterForm onLogin={() => {}} />
      </div>
    </div>
  );
}