import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section - Simplified for mobile */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Rejoignez notre réseau de transporteurs
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Développez votre activité en rejoignant notre plateforme de transport international.
          </p>
        </div>

        {/* Formulaire d'inscription - Optimisé pour mobile */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-8 max-w-4xl mx-auto">
          <CarrierSignupForm onSuccess={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}